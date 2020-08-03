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

//
// SESSION MIDDLEWARE :: Checks the Session Data and Loads it into the Request if Authorized.
//

// Custom Libraries
var P = require('../lib/patterns.lib.js');
var Error = require('../lib/error.lib.js');

// Export -- Requires DB Instance
module.exports = (DB) => {
    // Check Session Middleware
    return function(bypass,req, res, next) {
        // Session Info
        let uid = null;
        let token = null;
        let sessid = null;
        // Read Session Info
        if (req.session) {
            req.session.views = req.session.views ? req.session.views + 1 : 1
            sessid = req.session.sessid || req.cookies.csps_sessid_cookie;
            uid = req.session.uid || req.cookies.csps_uid_cookie;
            token = req.session.token || req.cookies.csps_token_cookie;
        }
        // Search for Session
        if (uid) {
            DB.select("*", "session", { uid: uid, session: sessid, token: token }, 1)
                .then((lookup) => {
                    let result = lookup.results;
                    if (result.length > 0) {
                        req.session.CSToken = token;
                        req.session.CSUid = uid;
                        req.session.CSSessid = sessid;
                        next();
                    } else {
                        if(bypass){
                            next();
                        }else{
                            Error.setError("Error: Unauthorized", 401, {});
                            Error.sendError(res);
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
                    if(bypass){
                        next();
                    }else{
                        Error.setError("Error: Unauthorized", 401, {});
                        Error.sendError(res);
                    }
                });
        } else {
            if(bypass){
                next();
            }else{
                Error.setError("Error: Unauthorized", 401, {});
                Error.sendError(res);
            }
        }
    };
}