# ProxiPay
ProxiPay is a Payment Gateway &amp; General wallet service powered by XRP (Ripple Ledger) &amp; Xpring &amp; PayID.

#### Quick Summary

From the portal you can setup a new wallet and using the credentials (assuming the account is funded) can then perform various actions such as issuing trust lines, currencies, performing trades and exchanges, as well as sending funds (both XRP and Issued Currencies).

#### Public Node 
This is currently using a **Testnet** Public Ripple Node (https://s.altnet.rippletest.net:51235) for the JSON-RPC calls.

#### Dependencies
This package is built on Node.JS, NPM (or Yarn), and Docker.

## Usage / How to Run

To get started, you can easily run the platform with docker using the `proxi-pay.ps1` (windows) or `proxi-pay.sh` (mac & linux).

This will run docker and spin the containers - Note: You may need to edit the `nginx.conf` file for the loadbalancer if you want different ports or SSL and or Domain name settings.

**SECURITY DISCLAIMER: Use common sense. Make sure you always keep your seeds and private keys and passphrases secured. I will not be responsible for any loss of funds due to user mistake or ignorance or incompetence.**

    Copyright 2020 (c) Kyle Derby MacInnis
