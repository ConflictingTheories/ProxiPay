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

// Custom Libraries
var P = require('../lib/patterns.lib.js');
var Error = require('../lib/error.lib.js')

module.exports = (DB) => {
    // Check User Data Middleware
    return (req, res, next) => {
        // --- VARIABLES ---
        // Stack
        var stack = {};
        // Promise Tools
        var via = P.via,
            register = P.registrator(stack),
            accumulate = P.accumulator(stack);
        // Read in Login Details
        var token = req.session.CSToken;
        var uid = req.session.CSUid;
        var sessid = req.session.CSSessid;
        // TODO
        let queryObject = { kp_stakeholderid: uid };
        DB.select("*", "stakeholder", queryObject, 1)
            .then((lookup) => {
                // Set CSUser
                req.CSUser = lookup.results[0];
                console.log(req.CSUser);
                if (req.CSUser.type === 'admin') {
                    req.CSAdmin = true;
                } else {
                    req.CSAdmin = false;
                }
                // Remove Password
                delete req.CSUser.str_passwd;
                console.log("FINISHED")
            })
            .then(() => {
                next();
            })
            .catch((err) => {
                Error.setError("Error: X-CU001", 500, err);
                Error.sendError(res);
            });
    };
}