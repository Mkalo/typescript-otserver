import { Binary } from '../src/binary';
import * as assert from 'assert';

describe('Binary', () => {
    it('Initalization', () => {
		const binary: Binary = new Binary(6);
		assert(binary.getLength() === 6, 'Should return 6.');
		assert(binary.getPosition() === 0, 'Init position should be equal to 0.');
    });

	it('setPosition and getPosition', () => {
		const binary: Binary = new Binary(6);
		binary.setPosition(3);
		assert(binary.getPosition() === 3, 'Current position should be equal to 3.');
    });

	it('canRead', () => {
		const binary: Binary = new Binary(6);
		binary.addUInt16(123);
		assert(binary.getPosition() === 2, 'Current position should be equal to 2.');
		assert(binary.canRead(1), 'Can read.');
		assert(!binary.canRead(5), 'Can\'t read.');
	});

	it('addString and readString', () => {
		const binary: Binary = new Binary(20);
		const str = 'Lallalalasld';
		binary.addString(str);
		binary.setPosition(0);
		assert(binary.readString() === str, 'Strings should be equal.');
	});

});
