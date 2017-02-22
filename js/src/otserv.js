"use strict";
var rsa_1 = require("./rsa");
var Otserv = (function () {
    function Otserv() {
    }
    Otserv.start = function () {
        var g_rsa = rsa_1.RSA.getInstance();
        var text = 'Hello RSA!';
        var encrypted = g_rsa.getRSA().encrypt(text, 'base64');
        console.log('encrypted: ', encrypted);
        var decrypted = g_rsa.getRSA().decrypt(encrypted, 'utf8');
        console.log('decrypted: ', decrypted);
        console.log("Server started!");
    };
    return Otserv;
}());
exports.Otserv = Otserv;
