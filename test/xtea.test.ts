import { XTEA } from '../src/xtea';
import { NetworkMessage, OutputMessage } from '../src/networkmessage';
import * as assert from 'assert';

describe('XTEA', () => {
    it('encrypt and decrypt', () => {
		const msg: OutputMessage = new OutputMessage();
		const xtea: XTEA = new XTEA(new Uint32Array([121324, 105464, 50055, 312015]));
		const str = "Mkalo is awesome.";
		msg.addString(str);
		xtea.encrypt(msg);
		xtea.decrypt(msg);
		msg.setPosition(0);
		assert(msg.readString() === str, 'String before and after encryption is not the same.');
    });
});
