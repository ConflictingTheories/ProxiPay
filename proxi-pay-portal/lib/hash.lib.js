// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis
const md5 = require('md5');
// Main Patterns Object
const Hash = {
    // MD5 HASH
    md5: (input) => {
        // TODO
        return md5(input);
    },
    // RSA HASH
    rsa: (input) => {
        // TODO
        return input + 'md5';
    },
    // UUID Generator
    uuid: (input) => {
        // TODO
        return input + Date.now();
    },
}

module.exports = Hash;