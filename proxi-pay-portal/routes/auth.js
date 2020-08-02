/*                                            *\
** ------------------------------------------ **
**      	CSPS PM Suite     	      **
** ------------------------------------------ **
**  Copyright (c) 2017-2018 - Kyle Derby MacInnis  **
**                                            **
** Any unauthorized distribution or transfer  **
**    of this work is strictly prohibited.    **
**                                            **
**           All Rights Reserved.             **
** ------------------------------------------ **
\*                                            */
// Third-party Libraries
var express = require('express');
var router = express.Router({
    mergeParams: true
});

// Custom Libraries
var P = require('../../lib/patterns.lib.js');
var Error = require('../../lib/error.lib.js');
var Hash = require('../../lib/hash.lib.js');

module.exports = (DB) => {

    // Middlewares
    const chkSessionMW = require('../../middleware/chk-session.mw.js')(DB);
    const chkUserMW = require('../../middleware/chk-user.mw.js')(DB);

    // GET /auth
    router.get('/', chkSessionMW.bind(null, false), chkUserMW, (req, res) => {
        // Read Session Data
        let user = req.CSUser;
        let is_admin = req.CSAdmin;
        // Setup Response
        let status = {
            user: user,
            is_authorized: true,
            is_admin: is_admin,
            status: 200,
            msg: "Success: Authorized!"
        };
        // Return
        res.json(status);
    });

    // POST /auth/login
    router.post('/login', (req, res) => {
        // --- VARIABLES ---
        // Stack
        var stack = {};
        // Promise Tools
        var via = P.via,
            register = P.registrator(stack),
            accumulate = P.accumulator(stack);
        // Read in Login Details
        let username = req.body.username,
            password = Hash.md5(req.body.password);
        // User Details
        let uid = null,
            sessid = null,
            token = null;
        let loginObj = {
            str_email: username,
            str_passwd: password
        };
        // Search for User
        DB.select("*", "stakeholder", loginObj, 1)
            .then((lookup) => register('sessionQuery', via(sessionQuery(lookup))))
            .then(() => register('sessionUpdate', via(sessionUpdate(stack.sessionQuery))))
            .then(() => register('sessionCheck', via(sessionCheck(stack.sessionUpdate))))
            .then(() => {;
                res.json(stack.sessionCheck)
            })
            .catch((err) => {
                Error.setError("Error: Login Failed", 400, err);
                Error.sendError(res);
            });

        // --- FUNCTIONS ---
        // Lookup User Login
        function sessionQuery(lookup) {
            return new Promise((resolve, reject) => {
                console.log(lookup)
                let results = lookup.results;
                // If User is Found
                if (results.length > 0) {
                    console.log(results);
                    // Generate New Session
                    uid = results[0].kp_stakeholderid;
                    sessid = Hash.uuid("csps-sessid-");
                    token = Hash.uuid("csps-token-");
                    // Set Session
                    req.session.uid = uid;
                    req.session.sessid = sessid;
                    req.session.token = token;
                    // Search for Previous Sessions
                    let sessionQuery = DB.select("*", "session", { uid: uid }, 1);
                    resolve(sessionQuery);
                } else {
                    reject("Session Query Failed");
                }
            });
        }
        // Insert / Update Session Info
        function sessionUpdate(lookup) {
            return new Promise((resolve, reject) => {
                let results = lookup.results;
                let sessionStored = null;
                if (results.length > 0) {
                    let sid = results[0].id;
                    let querySessionUpdate = "REPLACE INTO session VALUES (" + [DB.escape(sid), DB.escape(uid), DB.escape(sessid), DB.escape(token)].join(", ") + ")";
                    sessionStored = DB.query(querySessionUpdate);
                } else {
                    let querySessionInsert = "INSERT INTO session(uid,session,token) VALUES (" + [DB.escape(uid), DB.escape(sessid), DB.escape(token)].join(", ") + ")";
                    sessionStored = DB.query(querySessionInsert);
                }
                resolve(sessionStored);
            });
        }
        // Finish
        function sessionCheck(lookup) {
            return new Promise((resolve, reject) => {
                let results = lookup.results;
                if (results) {
                    // Set Cookies
                    var sessidcookie = req.cookies.csps_sessid_cookie;
                    if (sessidcookie === undefined) {
                        // no: set a new cookie
                        var sessidCookie = sessid;
                        res.cookie('csps_sessid_cookie', sessidCookie, {
                            maxAge: 24 * 60 * 60 * 1000,
                            httpOnly: true
                        });
                    }
                    var uidcookie = req.cookies.csps_uid_cookie;
                    if (uidcookie === undefined) {
                        // no: set a new cookie
                        var uidCookie = uid;
                        res.cookie('csps_uid_cookie', uidCookie, {
                            maxAge: 24 * 60 * 60 * 1000,
                            httpOnly: true
                        });
                    }
                    var tokencookie = req.cookies.csps_token_cookie;
                    if (tokencookie === undefined) {
                        // no: set a new cookie
                        var tokenCookie = token;
                        res.cookie('csps_token_cookie', tokenCookie, {
                            maxAge: 24 * 60 * 60 * 1000,
                            httpOnly: true
                        });
                    }
                    // Return Message
                    status = {
                        token: token,
                        uid: uid,
                        status: 200,
                        msg: "Success"
                    };
                    resolve(status);
                } else {
                    reject("ERROR -- Session Check");
                }
            });
        }
    });

    // POST /auth/login
    router.post('/logout',chkSessionMW.bind(null, true), (req, res) => {
        // --- VARIABLES ---
        // Stack
        var stack = {};
        // Promise Tools
        var via = P.via,
            register = P.registrator(stack),
            acscumulate = P.accumulator(stack);
        // Read in Login Details
        var token = req.session.CSToken;
        var uid = req.session.CSUid;
        var sessid = req.session.CSSessid;
        // Search for User
        let querySession = DB.select("*", "session", { uid: uid }, 1)
            .then((lookup) => register('sessionUpdate', via(sessionUpdate(lookup))))
            .then(() => register('sessionCheck', via(sessionCheck(stack.sessionUpdate))))
            .then(() => res.json(stack.sessionCheck))
            .catch((err) => {
                Error.setError("Error: Logout Failed", 400, stack);
                Error.sendError(res);
            });

        // --- FUNCTIONS ---
        // Insert / Update Session Info
        function sessionUpdate(lookup) {
            return new Promise((resolve, reject) => {
                let results = lookup ? lookup.results : [];
                console.log(results)
                let sessionStored = null;
                if (results.length > 0) {
                    let sid = results[0].id;
                    let sessionStored = DB.delete("session", {
                        uid: uid,
                        token: token
                    });
                } else {
                    sessionStored = {
                        results: true
                    };
                }
                resolve(sessionStored);
            });
        }
        // Finish
        function sessionCheck(lookup) {
            return new Promise((resolve, reject) => {
                let results = lookup.results;
                console.log(lookup);
                if (results) {
                    // Set Cookies
                    req.cookies.csps_sessid_cookie = null;
                    req.cookies.csps_uid_cookie = null;
                    req.cookies.csps_token_cookie = null;
                    // Return Message
                    status = {
                        status: 200,
                        msg: "Success"
                    };
                    resolve(status);
                } else {
                    reject("ERROR -- Session Check");
                }
            });
        }
    });

    return router;
}