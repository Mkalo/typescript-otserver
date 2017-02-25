import { XTEA } from '../src/xtea';
import { NetworkMessage } from '../src/networkmessage';

describe('XTEA', () => {
    it('encrypt and decrypt', () => {
		const msg: NetworkMessage = new NetworkMessage();
		const xtea: XTEA = new XTEA(new Uint32Array([121324, 105464, 50055, 312015]));
		const str = "Mkalo is awesome.";
		msg.addString(str);
		xtea.encrypt(msg);
		// xtea.decrypt(msg);
		// msg.setPosition(0);
		// // if (msg.readString() !== str) throw Error('String before and after encryption is not the same.');
    });
});
