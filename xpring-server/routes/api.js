/* ----------------------------- *\
//                               \\
//     XRP- Proof Of Concept     \\
// ----------------------------- \\
//      Copyright (c) 2018       \\
//      Kyle Derby MacInnis      \\
//      -------------------      \\
//          Created for          \\
//           Wolf Mask           \\
// ----------------------------- \\
// All Rights Reserved. Any Un-  \\
// authorized disribution and/or \\
// sale of this work is strictly \\
// prohibited.                   \\
\* ------------------------------ */

/* ------------------------------ *\
//       INDEX API ROUTER         \\
\* ------------------------------ */

const express = require('express');
const router = express.Router();
const { XRP_API, XPRING_API, XRP_Wallet, Utils } = require('../lib/XRP.lib');
const { XrpClient } = require('xpring-js');
const request = require('request-promise');
const xrpClient = XPRING_API;

/* GET API List page. */
router.get('/', function (req, res, next) {
    res.render('apilist', { title: 'API - Command List' });
});


// Generates new Wallet Information
router.get('/gen_wallet', function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    const result = XRP_Wallet.generateRandomWallet()
    res.json({
        result: {
            master_key: result.mnemonic,
            master_seed: result.wallet.privateKey,
            account_id: result.wallet.getAddress(),
            master_seed_hex: result.wallet.privateKey.toString('hex'),
            public_key: result.wallet.publicKey,
            public_key_hex: result.wallet.publicKey.toString('hex')
        }
    });
});


// Fetch Account Information 
router.get('/check_acct/:id', async function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let acctId = req.params.id;
    const addrLookup = Utils.isValidClassicAddress(acctId) ? Utils.encodeXAddress(acctId) : Utils.isValidXAddress(acctId) ? acctId : null;
    // if (await xrpClient.accountExists(addrLookup)) {
    //     res.json(await xrpClient.getBalance(addrLookup))
    // } else {
    //     res.json({ error: true, acct: acctId, addrLookup: addrLookup })
    // }
    XRP_API.account_info(acctId)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});


// Sign Payment w/ Secret
router.post('/account/:tx/flag/:flg', function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let sender = req.params.tx;
    let flag = req.params.flg;
    let secret = req.body.secret;

    XRP_API.setAccountFlag(flag, sender, secret)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});


// Sign Payment w/ Secret
router.post('/send_payment/:tx/:rx/secret', function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let sender = req.params.tx;
    let recv = req.params.rx;
    let amount = parseFloat(req.body.amount);
    let cur = req.body.currency;
    let issuer = req.body.issuer;
    let secret = req.body.secret;

    XRP_API.signPaymentSecret(amount, cur, sender, issuer, recv, secret)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});

// Sign Payment w/ Seed (using Xpring -- needs some work - seed is not valid)
router.post('/send_xrp/:rx/secret', function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let recv = req.params.rx;
    let amount = parseFloat(req.body.amount);
    let secret = req.body.secret;
    let seed = secret.replace(/.{1,2}/g, (temp) => String.fromCharCode(parseInt(temp, 16)));
    const wallet = XRP_Wallet.generateWalletFromSeed(seed);
    console.log(wallet);
    XRP_API.sendXrp(amount, recv, wallet).then((result) => {
        res.json(result);
    }).catch((err) => res.json(err));
});


// Sign Payment w/ Seed (using Xpring -- needs some work - seed is not valid)
router.get('/payid/:payid', async function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let payid = req.params.payid;
    let result = await XRP_API.getPayIdInfo(payid);
    res.json(result);
});



// Sign Offer w/ Secret
router.post('/trust/:tx/issue/:cur/:issuer/secret', function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let sender = req.params.tx;

    let amount = parseFloat(req.body.amount);
    let cur = req.params.cur;
    let issuer = req.params.issuer;

    let secret = req.body.secret;

    XRP_API.signTrustLineSecret(amount, cur, sender, issuer, secret)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});


// Sign Offer w/ Secret
router.post('/offer/:tx/trade/:pays/:gets/secret', function (req, res, next) {
    // TODO - Needs to Connect to the XRP Instance
    let sender = req.params.tx;

    let tcur = req.params.gets;
    let tamount = parseFloat(req.body.tamount)
    let tissuer = req.body.tissuer;

    let amount = parseFloat(req.body.amount);
    let cur = req.params.pays;
    let issuer = req.body.issuer;

    let secret = req.body.secret;

    XRP_API.signOfferTradeSecret(sender, tcur, tamount, tissuer, cur, amount, issuer, secret)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});

module.exports = router;