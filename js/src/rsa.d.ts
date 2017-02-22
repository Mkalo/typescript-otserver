import * as BigInteger from "big-integer";
import * as NodeRSA from "node-rsa";
export declare class RSA {
    private static defaultp;
    private static defaultq;
    p: BigInteger;
    q: BigInteger;
    n: BigInteger;
    d: BigInteger;
    e: BigInteger;
    dmp1: BigInteger;
    dmq1: BigInteger;
    coeff: BigInteger;
    key: NodeRSA;
    constructor();
    setRSA(p: string, q: string): void;
    getRSA(): NodeRSA;
    static getInstance(): RSA;
    private static instance;
}
