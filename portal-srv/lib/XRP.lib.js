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

// Configurationss
var Env = require('../etc/Env.conf')

// External Libraries
const axios = require('axios');
const websocket = require('websocket');
const wsClient = new websocket.w3cwebsocket(`${Env.XRP_PROTOCOL}${Env.XRP_HOST}:${Env.XRP_PORT}`);

const { Wallet, XrpClient, XrplNetwork, Utils } = require("xpring-js");
const xrpClient = new XrpClient(`${Env.XPRING_HOST}:${Env.XPRING_PORT}`, XrplNetwork.Test);

wsClient.onmessage = (x) => console.log("@@@@ -- ", x);
// Websocket to Node Connection
wsClient.onopen = () => {
    console.log('WebSocket Client Connected');
    wsClient.send({
        "id": 1,
        "command": "account_channels",
        "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "ledger_index": "validated"
    });
}
// Main API Object
const XRP_API = {
    // X Address Format (X....)
    toXaddress: (addr) => {
        return Utils.isValidClassicAddress(addr) ? Utils.encodeXAddress(addr) : Utils.isValidXAddress(addr) ? addr : false;
    },
    // Classic Address (r....)
    toClassicAddress: (addr) => {
        return Utils.isValidClassicAddress(addr) ? addr : Utils.isValidXAddress(addr) ? Utils.decodeXAddress(addr) : false;
    },
    // Propose a Wallet
    gen_wallet: (algo) => {
        // XRP Command
        let rpcRequest = {
            "method": "wallet_propose",
            "params": [{
                "key_type": algo ? algo : "secp256k1"
            }]
        };
        return XRP_API.sendRequest(rpcRequest);

    },
    // Check an Account's info
    account_info: (acct) => {
        // XRP Command
        let rpcRequest = {
            "method": "account_info",
            "params": [{
                "account": (acct ? acct : ""),
                "strict": true,
                "ledger_index": "current",
                "queue": true
            }]
        };
        return XRP_API.sendRequest(rpcRequest, true);
    },
    createPayID: (payidObj) => {
        return axios({
            url: `http://payid_server:8081/users`,
            data: payidObj,
            headers: { "PayID-API-Version": "2020-08-01", "Content-Type": "application/json" }
        });
    },
    // Send the server request
    sendRequest: (rpcRequest, rpc) => {
        return new Promise((resolve, reject) => {
            if (rpc) {
                // Options for POST
                let reqOptions = {
                    method: "POST",
                    data: rpcRequest,
                    url: Env.XRP_PROTOCOL + Env.XRP_HOST + ":" + Env.XRP_PORT,
                    headers: { "Content-Type": "application/json" }
                };
                console.log(JSON.stringify(reqOptions));
                // Submit
                resolve(axios(reqOptions))
            } else {
                if (wsClient && wsClient.connected) {
                    wsClient.onmessage = (result) => {
                        console.log('received -- ', result);
                        resolve(result);
                    };
                    wsClient.send(JSON.stringify(rpcRequest));
                }
            }
        });
    },
    //
    //
    // Submit 
    submitSignedBlob: (txBlob) => {
        let rpcRequest = {
            "method": "submit",
            "params": [{
                "tx_blob": txBlob
            }]
        };
        return XRP_API.sendRequest(rpcRequest, true);
    },
    // Transactions 
    signTxnSecret: (txJson, secret) => {
        let rpcRequest = {
            "method": "submit",
            "params": [{
                "offline": false,
                "secret": secret,
                "tx_json": txJson,
                "fee_mult_max": 1000,
            }]
        };
        return XRP_API.sendRequest(rpcRequest, true);
    },
    // Send a Payment
    setAccountFlag: (flag, sender, secret) => {
        let txJson = {
            "TransactionType": "AccountSet",
            "Account": sender,
            "SetFlag": flag,
        };
        return XRP_API.signTxnSecret(txJson, secret);
    },
    sendXrp: (amount, account, wallet) => {
        console.log(wallet, amount, account);
        return xrpClient.send(amount, account, wallet.wallet);
    },
    // Send a Payment
    signPaymentSecret: (amount, currency, sender, issuer, recv, secret) => {
        if (currency == "drops") {
            let txJson = {
                "Account": sender,
                "Amount": '' + amount,
                "Destination": recv,
                "TransactionType": "Payment"
            };
            return XRP_API.signTxnSecret(txJson, secret);
        } else {
            let txJson = {
                "Account": sender,
                "Amount": {
                    "currency": currency,
                    "issuer": issuer,
                    "value": '' + amount
                },
                "SendMax": {
                    "currency": currency,
                    "issuer": issuer,
                    "value": '' + amount
                },
                // "Paths": [
                //     [{
                //             "account": sender,
                //         },
                //         {
                //             "currency": currency,
                //             "issuer": issuer,
                //         },
                //         {
                //             "account": recv,
                //         }
                //     ]
                // ],
                "Flags": 131072,
                "Destination": recv,
                "TransactionType": "Payment"
            };
            return XRP_API.signTxnSecret(txJson, secret);
        }
    },
    // Setup Trust Line
    signTrustLineSecret: (amount, currency, sender, issuer, secret) => {
        let txJson = {
            "Account": sender,
            "TransactionType": "TrustSet",
            "LimitAmount": {
                "currency": currency,
                "issuer": issuer,
                "value": amount
            },
            "Flags": 262144
        }
        return XRP_API.signTxnSecret(txJson, secret);
    },
    // Send an Offer (Buy w/ XRP)
    signOfferBuyCurrencySecret: (tgets, currency, sender, amount, issuer, secret) => {
        let txJson = {
            "TransactionType": "OfferCreate",
            "Account": sender,
            "TakerGets": tgets,
            "TakerPays": {
                "currency": currency,
                "issuer": issuer,
                "value": amount
            }
        };
        return XRP_API.signTxnSecret(txJson, secret);
    },
    // Send an Offer (Buy w/ Currency)
    signOfferTradeSecret: (sender, tcurrency, tamount, tissuer, currency, amount, issuer, secret) => {
        let txJson = {
            "TransactionType": "OfferCreate",
            "Account": sender,
            "TakerGets": {
                "currency": tcurrency,
                "issuer": tissuer,
                "value": tamount
            },
            "TakerPays": {
                "currency": currency,
                "issuer": issuer,
                "value": amount
            }
        };
        if (String(tcurrency).toLowerCase() === "drops" || String(tcurrency).toUpperCase() === "XRP") {
            txJson.TakerGets = tamount;
        } else if (String(currency).toLowerCase() === "drops" || String(currency).toUpperCase() === "XRP") {
            txJson.TakerPays = amount;
        }
        return XRP_API.signTxnSecret(txJson, secret);
    },
    // Fetch PayID
    getPayIdInfo: async (payid) => {
        let url = `https://${payid.split('$')[1]}/${payid.split('$')[0]}`;
        return await axios({
            method: 'GET',
            url: url,
            headers: {
                'PayID-Version': '1.0',
                'Accept': 'application/payid+json'
            }
        });
    }
}


module.exports = { XRP_API, XPRING_API: xrpClient, XRP_Wallet: Wallet, Utils: Utils };