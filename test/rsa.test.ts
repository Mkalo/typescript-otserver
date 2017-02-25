import { RSA } from '../src/rsa';
import { NetworkMessage } from '../src/networkmessage';

describe('RSA', () => {
		const rsaInstance: RSA = RSA.getInstance();

    it('encrypt and decrypt', () => {
		const rsa = rsaInstance.getRSA();
		const text1: string = 'Hello RSA!';
		const text2: string = 'Lallalsdadsadad';
		
		const encrypted1: string = rsa.encrypt(text1, 'base64');
		const encrypted2: string = rsa.encrypt(text1, 'base64');
		const encrypted3: string = rsa.encrypt(text2, 'base64');
		
		const decrypted: string = rsa.decrypt(encrypted1, 'utf8');
		const decrypted2: string = rsa.decrypt(encrypted3, 'utf8');

		if (decrypted !== text1) throw Error('String should be equal.');
		if (decrypted2 === text1) throw Error('Strings should be different.');
		if (encrypted1 === encrypted2) throw Error('Encrypt should always produce different encrypted string.');
    });
});
