/* ----------------------------- *\
//                               \\
//  ProxiPay - Proof Of Concept  \\
// ----------------------------- \\
//      Copyright (c) 2020       \\
//      Kyle Derby MacInnis      \\
// ----------------------------- \\
// All Rights Reserved. Any Un-  \\
// authorized disribution and/or \\
// sale of this work is strictly \\
// prohibited.                   \\
\* ------------------------------ */

/* ------------------------------ *\
//       INDEX API ROUTER         \\
\* ------------------------------ */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'ProxiPay - Xpring & PayID Portal - Home',
        preloaded: false,
        type: false,
        details: {}
    });
});

// Wallet Generator
router.get('/wallet-generate', function(req, res, next) {
    res.render('index', {
        title: 'ProxiPay - Xpring & PayID Portal - Wallet Generator',
        preloaded: true,
        type: 'wallet',
        details: {}
    });
});

// Account Viewer
router.get('/account', function(req, res, next) {
    res.render('index', {
        title: 'ProxiPay - Xpring & PayID Portal - Account Details',
        preloaded: false,
        type: 'accounts',
        details: {}
    });
});

router.get('/account/:id', function(req, res, next) {
    res.render('index', {
        title: `ProxiPay - Xpring & PayID Portal - Account Details: ${req.params.id}`,
        preloaded: req.params.id,
        type: 'accounts',
        details: {}
    });
});

// Account Viewer
router.get('/send', function(req, res, next) {
    res.render('index', {
        title: 'ProxiPay - Xpring & PayID Portal - Send Funds',
        preloaded: true,
        type: 'funds',
        details: {}
    });
});

// Account Viewer
router.get('/send/:cur/:iss/:amt/:recv', function(req, res, next) {
    let cur = req.params.cur || "XRP";
    let iss = req.params.iss || "";
    let amt = req.params.amt || "0";
    let recv = req.params.recv || "";
    res.render('index', {
        title: `ProxiPay - Xpring & PayID Portal - Send Funds (${amt} ${cur} from ${iss} to ${recv})`,
        preloaded: true,
        type: 'funds',
        details: { cur: cur, amt: amt, recv: recv, iss: iss }
    });
});

// Trust Line Creator
router.get('/trust', function(req, res, next) {
    res.render('index', {
        title: 'ProxiPay - Xpring & PayID Portal - Trust Lines',
        preloaded: true,
        type: 'trust',
        details: {}
    });
});
// Order Exchange
router.get('/exchange', function(req, res, next) {
    res.render('index', {
        title: 'ProxiPay - Xpring & PayID Portal - Exchange Currencies',
        preloaded: true,
        type: 'exchange',
        details: {}
    });
});
// Transcation Viewer <TODO>
router.get('/txn', function(req, res, next) {
    res.render('transaction', {
        title: 'ProxiPay - Xpring & PayID Portal - Transactions',
        preloaded: true,
        type: 'txn',
        details: {}
    });
});
// Transaction by ID <TODO>
router.get('/txn/:id', function(req, res, next) {
    console.log("PRELOADED", req.params.id)
    res.render('transaction', {
        title: `ProxiPay - Xpring & PayID Portal - Transaction ${req.params.id}`,
        preloaded: req.params.id,
        type: 'txn',
        details: {}
    })
});

module.exports = router;