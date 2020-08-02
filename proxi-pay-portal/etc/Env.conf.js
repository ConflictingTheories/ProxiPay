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
//        ENVIRONMENT CONF        \\
\* ------------------------------ */

module.exports = {
    // Future - Unused
    AWS_APIKEY: "",
    GOOGLE_APIKEY: "",
    STRIPE_APIKEY: "",
    SENDGRID_APIKEY: "",
    // Database (MySQL)
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    // For Ripple Direct (TestNet)
    XRP_HOST: "s.altnet.rippletest.net",
    XRP_PORT: "51235",
    XRP_PROTOCOL: "https://",
    // Xpring SDK (Test Net)
    XPRING_HOST: "test.xrp.xpring.io",
    XPRING_PORT: "50051",
};