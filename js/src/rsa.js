"use strict";
var BigInteger = require("big-integer");
var NodeRSA = require("node-rsa");
var RSA = (function () {
    function RSA() {
        this.key = new NodeRSA({ b: 1024 });
        this.setRSA(RSA.defaultp, RSA.defaultq);
    }
    RSA.prototype.setRSA = function (p, q) {
        this.p = BigInteger(p);
        this.q = BigInteger(q);
        this.n = BigInteger(this.p.multiply(this.q).toString());
        this.e = BigInteger(65537);
        var p_1 = this.p.subtract(1);
        var q_1 = this.q.subtract(1);
        var pq_1 = p_1.multiply(q_1);
        this.d = this.e.modInv(pq_1);
        this.dmp1 = this.d.mod(p_1);
        this.dmq1 = this.d.mod(q_1);
        this.coeff = this.q.modInv(this.p);
        this.key.importKey({
            n: this.n.toString(),
            e: this.e.toJSNumber(),
            d: this.d.toString(),
            p: this.p.toString(),
            q: this.q.toString(),
            dmp1: this.dmp1.toString(),
            dmq1: this.dmq1.toString(),
            coeff: this.coeff.toString()
        }, "components");
    };
    RSA.prototype.getRSA = function () {
        return this.key;
    };
    RSA.getInstance = function () {
        return this.instance;
    };
    return RSA;
}());
RSA.defaultp = "14299623962416399520070177382898895550795403345466153217470516082934737582776038882967213386204600674145392845853859217990626450972452084065728686565928113";
RSA.defaultq = "7630979195970404721891201847792002125535401292779123937207447574596692788513647179235335529307251350570728407373705564708871762033017096809910315212884101";
RSA.instance = new RSA();
exports.RSA = RSA;
