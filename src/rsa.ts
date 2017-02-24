import * as BigInteger from "big-integer";
import * as NodeRSA from "node-rsa";

export class RSA {

	private static defaultp: string = "14299623962416399520070177382898895550795403345466153217470516082934737582776038882967213386204600674145392845853859217990626450972452084065728686565928113";
	private static defaultq: string = "7630979195970404721891201847792002125535401292779123937207447574596692788513647179235335529307251350570728407373705564708871762033017096809910315212884101";

	private p: BigInteger;
	private q: BigInteger;
	private n: BigInteger;
	private d: BigInteger;
	private e: BigInteger;
	private dmp1: BigInteger;
	private dmq1: BigInteger;
	private coeff: BigInteger;
	private key: NodeRSA = new NodeRSA({ b: 1024 });

	private constructor() {
		this.setRSA(RSA.defaultp, RSA.defaultq);
	}

	public setRSA(p: string, q: string) {
		this.p = BigInteger(p);
		this.q = BigInteger(q);
		this.n = BigInteger(this.p.multiply(this.q).toString());
		this.e = BigInteger(65537);

		let p_1: BigInteger = this.p.subtract(1);
		let q_1: BigInteger = this.q.subtract(1);
		let pq_1: BigInteger = p_1.multiply(q_1);

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
	}

	public getRSA(): NodeRSA {
		return this.key;
	}

	public static getInstance(): RSA {
		return this.instance;
	}

	private static instance: RSA = new RSA();
    
}
