import * as bignum from 'bignum';

export class RSA {

	private static defaultp: string = "14299623962416399520070177382898895550795403345466153217470516082934737582776038882967213386204600674145392845853859217990626450972452084065728686565928113";
	private static defaultq: string = "7630979195970404721891201847792002125535401292779123937207447574596692788513647179235335529307251350570728407373705564708871762033017096809910315212884101";
	private static instance: RSA = new RSA();

	private n: bignum;
	private d: bignum;

	protected constructor() {
		this.setRSA(RSA.defaultp, RSA.defaultq);
	}

	public setRSA(_p: string, _q: string) {
		const p = bignum(_p);
		const q = bignum(_q);
		this.n = bignum(p.mul(q).toString());
		const e = bignum(65537);

		const p_1: bignum = p.sub(1);
		const q_1: bignum = q.sub(1);
		const pq_1: bignum = p_1.mul(q_1);

		this.d = e.invertm(pq_1);
	}

	public decrypt(buffer: Buffer, start: number = 0): void {
		const bufferToDecrypt: Buffer = new Buffer(128);
		buffer.copy(bufferToDecrypt, 0, start, start + 128);

		const bufferInt = bignum.fromBuffer(bufferToDecrypt);
		const decrypted = bignum.powm(bufferInt, this.d, this.n).toBuffer();

		let success = decrypted.length === 127;

		buffer[start] = success ? 0 : 1;
		decrypted.copy(buffer, start + 1, 0, 127);
	}

	public static getInstance(): RSA {
		return this.instance;
	}
}
