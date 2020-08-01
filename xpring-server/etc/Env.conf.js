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
    AWS_APIKEY: "",
    GOOGLE_APIKEY: "",
    STRIPE_APIKEY: "",
    SENDGRID_APIKEY: "",
    // For Ripple Direct (Non Xpring SDK)
    XRP_HOST: "s1.ripple.com",
    XRP_PORT: "51234",
    XRP_PROTOCOL: "https://",
    // Xpring SDK
    XPRING_HOST: "main.xrp.xpring.io",
    XPRING_PORT: "50051",
};