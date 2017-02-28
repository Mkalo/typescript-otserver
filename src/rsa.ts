import * as BigInteger from "big-integer";
import * as NodeRSA from "node-rsa";

export class RSA {

	private static defaultp: string = "14299623962416399520070177382898895550795403345466153217470516082934737582776038882967213386204600674145392845853859217990626450972452084065728686565928113";
	private static defaultq: string = "7630979195970404721891201847792002125535401292779123937207447574596692788513647179235335529307251350570728407373705564708871762033017096809910315212884101";
    private static instance: RSA = new RSA();

	private p: BigInteger;
	private q: BigInteger;
	private n: BigInteger;
	private d: BigInteger;
	private e: BigInteger;
	private dmp1: BigInteger;
	private dmq1: BigInteger;
	private coeff: BigInteger;
	private key: NodeRSA = new NodeRSA({ b: 1024 });    

	protected constructor() {
		this.setRSA(RSA.defaultp, RSA.defaultq);
	}

	public setRSA(p: string, q: string) {
		this.p = BigInteger(p);
		this.q = BigInteger(q);
		this.n = BigInteger(this.p.multiply(this.q).toString());
		this.e = BigInteger(65537);

		const p_1: BigInteger = this.p.subtract(1);
		const q_1: BigInteger = this.q.subtract(1);
		const pq_1: BigInteger = p_1.multiply(q_1);

		this.d = this.e.modInv(pq_1);
		this.dmp1 = this.d.mod(p_1);
		this.dmq1 = this.d.mod(q_1);
		this.coeff = this.q.modInv(this.p);
	}

	public getRSA(): NodeRSA {
		return this.key;
	}

    public decrypt(buffer: Buffer): Buffer {
        const c: BigInteger = BigInteger(buffer.toString("hex"), 16);
        // m = c^d mod n
        const m: BigInteger = c.modPow(this.d, this.n);
        return Buffer.from(m.toString(16), "hex");
    }

	public static getInstance(): RSA {
		return this.instance;
	}
}
