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

const API_URL="https://proxi-001.kderbyma.com"


// WALLET GENERATOR FUNCTIONS
// --------------------------
// QR Codes
var walletAcctCode = null;
var walletMastCode = null;
var walletPubCode = null;
var payidInUse = false;
var payidAddr = null;

// Generate Wallet
function genWallet() {

    Swal.fire({
        title: 'Warning!',
        text: 'Make sure you keep your wallet details confidential and do not lose them. You can print the screen for an offline copy.',
        type: 'warning',
        confirmButtonText: 'I Understand',
        showCancelButton: true
    })
        .then((res) => {
            console.log(res);
            if (res.dismiss) {
                return false;
            } else {
                $.ajax({
                    url: "/api/gen_wallet",
                    method: "get",
                    success: function (result) {
                        console.log(result.result)

                        let obj = result.result;
                        let master_key = obj.master_key;
                        let master_seed = obj.master_seed;
                        let w_account_id = obj.account_id;
                        let master_seed_hex = obj.master_seed_hex;
                        let public_key = obj.public_key;
                        let public_key_hex = obj.public_key_hex;
                        let key_type = obj.key_type;
                        let payid = obj.payid;

                        $("#wallet_qrcode_w_account").html();
                        $("#qrcode_master_seed").html();
                        $("#qrcode_public_key").html();

                        if (walletAcctCode) {
                            walletAcctCode.clear();
                            walletAcctCode.makeCode(w_account_id);

                        } else {
                            walletAcctCode = new QRCode(document.getElementById("wallet_qrcode_w_account"), w_account_id);
                        }

                        if (walletMastCode) {
                            walletMastCode.clear();
                            walletMastCode.makeCode(master_seed);

                        } else {
                            walletMastCode = new QRCode(document.getElementById("qrcode_master_seed"), master_seed);
                        }

                        if (walletPubCode) {
                            walletPubCode.clear();
                            walletPubCode.makeCode(public_key);

                        } else {
                            walletPubCode = new QRCode(document.getElementById("qrcode_public_key"), public_key);

                        }

                        $("#w_account").text(w_account_id);
                        $("#master_key").text(master_key);
                        $("#master_seed").text(master_seed);
                        $("#master_seed_hex").text(master_seed_hex);
                        $("#public_key").text(public_key);
                        $("#public_key_hex").text(public_key_hex);
                        $("#payid").text(payid);
                        $("#output").text(JSON.stringify(result.result, undefined, 4));

                        M.toast({
                            html: 'Success!'
                        })

                    }

                });
            }
        })
}


// ACCOUNT TAB FUNCTIONS 
// ----------------------
// QR Code
var acctCode = null;
// Check Account Info
function checkAccount(loaded) {
    let acct = $('#account_num').val();
    if (acct.indexOf('$') >= 0) {
        $.ajax({
            url: "/api/payid/" + acct,
            method: "get",
            success: function (result) {
                let addr = result.addresses.filter(x => x.paymentNetwork === 'XRPL')[0].addressDetails.address;
                M.toast({
                    html: 'PayID Found - Receiver Set!'
                })
                fetchDetails(addr);
            }
        })
    } else {
        payidInUse = false;
        fetchDetails(acct);
    }
};

// Fetch Account Info
function fetchDetails(acct) {
    if (!loaded) {
        document.location = "/account/" + acct;
    } else {
        $.ajax({
            url: "/api/check_acct/" + acct,
            method: "get",
            success: function (result) {
                console.log(result.result)
                let obj = result.result;
                if (obj.error) {
                    var account_id = acct;
                    var balance = "Account Not Initialized Yet";
                    var flags = "N/A";
                    var ledgertype = "N/A";
                    var ownercount = "N/A";
                    var prevtxid = "N/A";
                    var prevledger = "N/A";
                    var sequence = "N/A";
                    var index = "N/A";
                } else {
                    var account_id = acct;
                    var balance = (obj.account_data.Balance / 1000000);
                    var flags = obj.account_data.Flags;
                    var ledgertype = obj.account_data.LedgerEntryType;
                    var ownercount = obj.account_data.OwnerCount;
                    var prevtxid = obj.account_data.PreviousTxnID;
                    var prevledger = obj.account_data.PreviousTxnLgrSeq;
                    var sequence = obj.account_data.Sequence;
                    var index = obj.account_data.index;
                }

                // QR CODE
                $("#qrcode_account").html();
                if (acctCode) {
                    acctCode.clear();
                    acctCode.makeCode(account_id);
                } else {
                    acctCode = new QRCode(document.getElementById("qrcode_account"), account_id);
                }

                // DETAILS
                $("#account").text(account_id);
                $("#balance").text(balance);
                $("#flags").text(flags);
                $("#ledgertype").text(ledgertype);
                $("#ownercount").text(ownercount);
                $("#prevtxid").text(prevtxid);
                $("#prevledger").text(prevledger);
                $("#sequence").text(sequence);
                $("#index").text(index);

                // RAW OUTPUT
                $("#output").text(JSON.stringify(result.result, undefined, 5));

                M.toast({
                    html: 'Done'
                })
            }
        });
    }
}
// SEND FUND FUNCTIONS
// --------------------

var sendCode = null;
var recvCode = null;

// Update the QR Code
function updateSender() {
    $("#qrcode_send").html();
    let send = $('#send-account').val();
    if (String(send).length == 34) {
        if (sendCode) {
            sendCode.clear();
            sendCode.makeCode(send);
        } else {
            sendCode = new QRCode(document.getElementById("qrcode_send"), send);
        }
    } else {
        console.log(String(send).length);
    }
}
// Update the QR Code
function updateRecv() {
    $("#qrcode_recv").html();
    let recv = $('#rx-account').val();

    if (recv.indexOf('$') >= 0) {
        $.ajax({
            url: "/api/payid/" + recv,
            method: "get",
            success: function (result) {
                let addr = result.addresses.filter(x => x.paymentNetwork === 'XRPL')[0].addressDetails.address;
                payidAddr = addr;
                payidInUse = true;
                if (recvCode) {
                    recvCode.clear();
                    recvCode.makeCode(addr);
                } else {
                    recvCode = new QRCode(document.getElementById("qrcode_recv"), addr);
                }
                M.toast({
                    html: 'PayID Found - Receiver Set!'
                })
            }
        })
    } else {
        payidInUse = false;
        if (String(recv).length == 34) {
            payidAddr = recv;
            if (recvCode) {
                recvCode.clear();
                recvCode.makeCode(recv);
            } else {
                recvCode = new QRCode(document.getElementById("qrcode_recv"), recv);
            }
            M.toast({
                html: 'Receiver Set!'
            })
        }
    }

}
// Send Payment
function sendPayment() {
    let send = $('#send-account').val();
    let recv = payidAddr || '';
    let issuer = $('#issuerpayment').val();
    let cur = $('#cur-type').val();
    let amount = $('#cur-amount').val();
    let seed = $('#seed').val();

    if (cur == "drops") {
        amount = parseInt(parseFloat(amount) * 1000000);
    }

    let paymentRequest = {
        issuer: issuer,
        amount: '' + amount,
        currency: cur,
        secret: seed
    };
    console.log(paymentRequest);
    if (cur && amount && (issuer || cur == "drops") && recv && seed) {
        Swal.fire({
            title: 'Warning!',
            text: 'Make sure you have confirmed the recipient address and are sure it is correct. Once sent, a payment cannot be reversed.',
            type: 'warning',
            confirmButtonText: 'I Understand',
            showCancelButton: true
        })
            .then((res) => {
                console.log(res);
                if (res.dismiss) {
                    return false;
                } else {
                    // Send TX
                    $.ajax({
                        url: "/api/send_payment/" + send + "/" + recv + "/secret",
                        method: "post",
                        data: paymentRequest,
                        success: function (result) {
                            if (result.errorType === 5) {
                                M.toast({
                                    html: 'Error! - Account not Found or Insufficient Balance to Fund Account'
                                })
                                return;
                            }
                            console.log(result.result)
                            let obj = result.result;
                            if (obj.error) {
                                M.toast({
                                    html: 'Error!'
                                })
                            } else {
                                M.toast({
                                    html: 'Success!'
                                })
                            }

                            // RAW OUTPUT
                            $("#output-txn").text(JSON.stringify(result.result, undefined, 5));
                        }
                    });
                }
            });
    } else {
        Swal.fire({
            title: 'Missing Information!',
            text: 'Please fill in the amount, the receiving address, and the if it is not XRP, the issuing address. Then try again.',
            type: 'error',
            confirmButtonText: 'Got it, Thanks',
        })
            .then((res) => {
                console.log(res);
            });
    }
}

function sendXrpPayment() {
    let recv = payidAddr || '';
    let amount = $('#cur-amount').val();
    let seed = $('#seed').val();
    // Drop
    amount = parseInt(parseFloat(amount) * 1000000);

    let paymentRequest = {
        recv: recv,
        amount: '' + amount,
        secret: seed
    };
    console.log(paymentRequest);

    // Send TX
    $.ajax({
        url: "/api/send_xrp/" + recv + "/secret",
        method: "post",
        data: paymentRequest,
        success: function (result) {
            if (result.errorType && result.errorType === 5) {
                M.toast({
                    html: 'Invalid Address - Double check it or make sure you send enough funds to open it (22 XRP)!'
                })
                return;
            }
            console.log(result.result)
            let obj = result.result;
            if (obj.error) {
                M.toast({
                    html: 'Error!'
                })
            } else {
                M.toast({
                    html: 'Success!'
                })
            }

            // RAW OUTPUT
            $("#output-txn").text(JSON.stringify(result.result, undefined, 5));
        }
    });
}

function sharePaymentLink() {
    let recv = payidAddr || '';
    let issuer = $('#issuerpayment').val();
    let cur = $('#cur-type').val();
    let amount = $('#cur-amount').val();
    let paymentLink = `${API_URL}/send/${cur}/${issuer}/${amount}/${recv}`;

    if (cur == "drops") {
        paymentLink = `${API_URL}/send/${cur}/_na_/${amount}/${recv}`;
    }

    if (cur && amount && (issuer || cur == "drops") && recv) {
        Swal.fire({
            title: 'Share your Payment Link!',
            input: 'url',
            inputClass: 'copyBtn',
            html: '<p>Below is your payment link - share this to receive the payment as an easy to use shortcut. All they need to do is fill in their account and secret key.</p>' +
                '<button class="copyBtn swal2-confirm swal2-styled" data-clipboard-text="' + paymentLink + '">Copy to clipboard</button>',
            onOpen: copyInit,
            inputValue: paymentLink,
            type: 'success',
            confirmButtonText: 'Got it, Thanks',
        })
            .then((res) => {
                console.log(res);
            });
    } else {
        Swal.fire({
            title: 'Missing Information!',
            text: 'Please fill in the amount, the receiving address, and the if it is not XRP, the issuing address. Then try again.',
            type: 'error',
            confirmButtonText: 'Got it, Thanks',
        })
            .then((res) => {
                console.log(res);
            });
    }
}

function copyInit() {
    var clipboard = new ClipboardJS('.copyBtn');

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}
// Send account flag (hidden)
function setAccountFlag(flg) {
    let send = $('#send-account').val();
    let seed = $('#seed').val();

    let paymentRequest = {
        secret: seed
    };
    console.log(paymentRequest);
    // Send TX
    $.ajax({
        url: "/api/account/" + send + "/flag/" + flg,
        method: "post",
        data: paymentRequest,
        success: function (result) {
            console.log(result.result)
            let obj = result.result;
            if (obj.error) {

            } else {

            }

            // RAW OUTPUT
            $("#output-txn").text(JSON.stringify(result.result, undefined, 5));
        }
    });
}

// TRUST LINE FUNCTIONS
// --------------------

var issueCode = null;
var trustCode = null;

// Update the QR Code
function updateIssuer() {
    $("#qrcode_issue").html();
    let send = $('#issue-account').val();
    if (String(send).length == 34) {
        if (issueCode) {
            issueCode.clear();
            sendCissueCodeode.makeCode(send);
        } else {
            issueCode = new QRCode(document.getElementById("qrcode_issue"), send);
        }
    } else {
        console.log(String(send).length);
    }
}
// Update the QR Code
function updateTrustee() {
    $("#qrcode_trust").html();
    let recv = $('#trust-account').val();
    if (String(recv).length == 34) {
        if (trustCode) {
            trustCode.clear();
            trustCode.makeCode(recv);
        } else {
            trustCode = new QRCode(document.getElementById("qrcode_trust"), recv);
        }
    }
}

// Issue Trust Line
function issueTrust() {
    let send = $('#issue-account').val();
    let recv = $('#trust-account').val();
    let cur = $('#trust-type').val();
    let amount = $('#trust-amount').val();
    let seed = $('#trust-seed').val();

    if (cur == "drops") {
        amount = parseInt(parseFloat(amount) * 1000000);
    }

    let paymentRequest = {
        issuer: send,
        account: recv,
        amount: parseFloat(amount),
        currency: cur,
        secret: seed
    };
    console.log(paymentRequest);

    if (cur && amount && (issuer || cur == "drops") && recv && seed) {

        Swal.fire({
            title: 'Warning!',
            text: 'Make sure you have confirmed the issuing address and are sure it is correct. You should make sure you trust the account.',
            type: 'warning',
            confirmButtonText: 'I Understand',
            showCancelButton: true
        })
            .then((res) => {
                console.log(res);
                if (res.dismiss) {
                    return false;
                } else {
                    // Send TX
                    $.ajax({
                        url: "/api/trust/" + recv + "/issue/" + cur + "/" + send + "/secret",
                        method: "post",
                        data: paymentRequest,
                        success: function (result) {
                            console.log(result.result)
                            let obj = result.result;
                            if (obj.error) {

                            } else {

                            }

                            // RAW OUTPUT
                            $("#output-trust").text(JSON.stringify(result.result, undefined, 5));
                        }
                    });
                }
            });
    } else {
        Swal.fire({
            title: 'Missing Information!',
            text: 'Please fill in the amount, the issuing address, your secret, and your account. Then try again.',
            type: 'error',
            confirmButtonText: 'Got it, Thanks',
        })
            .then((res) => {
                console.log(res);
            });
    }
}


// OFFER FUNCTIONS
// --------------------

var issCode = null;
var trustCode = null;

// Update the QR Code
function updateIssuers() {
    $("#qrcode_iss").html();
    let send = $('#iss-account').val();
    if (String(send).length == 34) {
        if (issueCode) {
            issueCode.clear();
            sendCissueCodeode.makeCode(send);
        } else {
            issueCode = new QRCode(document.getElementById("qrcode_iss"), send);
        }
    } else {
        console.log(String(send).length);
    }
}

function updateTIssuer() {
    $("#qrcode_tiss").html();
    let send = $('#tiss-account').val();
    if (String(send).length == 34) {
        if (issueCode) {
            issueCode.clear();
            sendCissueCodeode.makeCode(send);
        } else {
            issueCode = new QRCode(document.getElementById("qrcode_tiss"), send);
        }
    } else {
        console.log(String(send).length);
    }
}
// Update the QR Code
function updateOfferee() {
    $("#qrcode_trust").html();
    let recv = $('#trust-account').val();
    if (String(recv).length == 34) {
        if (trustCode) {
            trustCode.clear();
            trustCode.makeCode(recv);
        } else {
            trustCode = new QRCode(document.getElementById("qrcode_trust"), recv);
        }
    }
}
// Send Payment
function makeOffer() {
    let send = $('#offer-account').val();

    let issuer = $('#tiss-account').val();
    let tissuer = $('#iss-account').val();

    let cur = $('#take-type').val();
    let tcur = $('#give-type').val();

    let amount = $('#take-amount').val();
    let tamount = $('#give-amount').val();

    let seed = $('#offer-seed').val();

    if (cur == "drops") {
        amount = parseInt(parseFloat(amount) * 1000000);
    }
    if (tcur == "drops") {
        tamount = parseInt(parseFloat(tamount) * 1000000);
    }

    let paymentRequest = {
        account: send,
        amount: parseFloat(amount),
        currency: cur,
        issuer: issuer,
        tamount: parseFloat(tamount),
        tcurrency: tcur,
        tissuer: tissuer,
        secret: seed
    };
    console.log(paymentRequest);
    // Send TX
    if (cur && amount && (issuer || cur == "drops") && (tissuer || tcur == "drops") && send && seed) {

        Swal.fire({
            title: 'Warning!',
            text: 'Make sure you have confirmed the order and are sure it is correct. It may be cleared immediately, to remove it you will have to cancel the order. (feature coming soon)',
            type: 'warning',
            confirmButtonText: 'I Understand',
            showCancelButton: true
        })
            .then((res) => {
                console.log(res);
                if (res.dismiss) {
                    return false;
                } else {
                    $.ajax({
                        url: "/api/offer/" + send + "/trade/" + cur + "/" + tcur + "/secret",
                        method: "post",
                        data: paymentRequest,
                        success: function (result) {
                            console.log(result.result)
                            let obj = result.result;
                            if (obj.error) {

                            } else {

                            }

                            // RAW OUTPUT
                            $("#output-offer").text(JSON.stringify(result.result, undefined, 5));
                        }
                    });
                }
            });
    } else {
        Swal.fire({
            title: 'Missing Information!',
            text: 'Please fill in all the information, then try again.',
            type: 'error',
            confirmButtonText: 'Got it, Thanks',
        })
            .then((res) => {
                console.log(res);
            });
    }
}