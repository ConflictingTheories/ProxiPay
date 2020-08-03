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

const express = require('express');
const router = express.Router();
const { XRP_API, XRP_Wallet } = require('../lib/XRP.lib');

/* GET API List page. */
router.get('/', function (req, res, next) {
    res.render('apilist', { title: 'API - Command List' });
});

function genName() {
    let otps = "abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUV";
    return 'xxxxxx'.replace(/x/, () => opts[~~((Math.random() * otps.length) % otps.length)]);
}
// Generates new Wallet Information
router.get('/gen_wallet', function (req, res, next) {
    const result = XRP_Wallet.generateRandomWallet();
    const payidprefix = genName();
    const url = `http://payid.kderbyma.com/users}`;
    const payidObj = {
        "payId": `${payidprefix}$payid.kderbyma.com`,
        "addresses": [
            {
                "paymentNetwork": "XRPL",
                "environment": "TESTNET",
                "details": {
                    "address": result.wallet.getAddress(),
                }
            }
        ]
    };
    const payid = await axios({
        url: url,
        data: payidObj,
        headers: { "PayID-API-Version": "1.1.0", "Content-Type": "application/json" }
    })
    res.json({
        result: {
            payid: payidprefix,
            payidResult:payid,
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
    let acctId = req.params.id;
    XRP_API.account_info(XRP_API.toClassicAddress(acctId))
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});


// Sign Payment w/ Secret
router.post('/account/:tx/flag/:flg', function (req, res, next) {
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
router.post('/send_payment_node/:tx/:rx/secret', function (req, res, next) {
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


// Sign Payment w/ Secret
router.post('/send_payment/:tx/:rx/secret', function (req, res, next) {
    let sender = req.params.tx;
    let recv = req.params.rx;
    let amount = parseFloat(req.body.amount);
    let cur = req.body.currency;
    let issuer = req.body.issuer;
    let secret = req.body.secret;
    // Using Lite Node (Local Container)
    XRP.signPaymentSecret(amount, cur, sender, issuer, recv, secret)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err))
});

// Sign Payment w/ Seed (using Xpring)
router.post('/send_xrp/:rx/secret', function (req, res, next) {
    let recv = req.params.rx;
    let amount = parseFloat(req.body.amount);
    let secret = req.body.secret;
    let seed = secret.replace(/.{1,2}/g, (temp) => String.fromCharCode(parseInt(temp, 16)));
    const wallet = XRP_Wallet.generateWalletFromSeed(seed);
    XRP_API.sendXrp(amount, recv, wallet).then((result) => {
        res.json(result);
    }).catch((err) => res.json(err));
});

// PayID Resolution
router.get('/payid/:payid', async function (req, res, next) {
    let payid = req.params.payid;
    let result = await XRP_API.getPayIdInfo(payid);
    res.json(result);
});


// Sign Offer w/ Secret
router.post('/trust/:tx/issue/:cur/:issuer/secret', function (req, res, next) {
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