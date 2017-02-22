"use strict";
var rsa_1 = require("./rsa");
var Otserv = (function () {
    function Otserv() {
    }
    Otserv.start = function () {
        var test = new rsa_1.RSA();
        console.log("Server started!");
    };
    return Otserv;
}());
exports.Otserv = Otserv;
