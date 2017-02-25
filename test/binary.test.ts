import { Binary } from '../src/binary';

describe('Binary', () => {
    it('Initalization', () => {
		const binary: Binary = new Binary(6);
		if (binary.getLength() !== 6) throw Error('Should return 6.');
		if (binary.getPosition() !== 0) throw Error('Init position should be equal to 0.');
    });

	it('setPosition and getPosition', () => {
		const binary: Binary = new Binary(6);
		binary.setPosition(3);
		if (binary.getPosition() !== 3) throw Error('Current position should be equal to 3.');
    });

	it('canRead', () => {
		const binary: Binary = new Binary(6);
		binary.addUInt16(123);
		if (binary.getPosition() !== 2) throw Error('Current position should be equal to 2.');
		if (binary.canRead(1) !== true) throw Error('Can read.');
		if (binary.canRead(5) === true) throw Error('Can\'t read.');
	});

	it('addString and readString', () => {
		const binary: Binary = new Binary(20);
		const str = 'Lallalalasld';
		binary.addString(str);
		binary.setPosition(0);
		if (binary.readString() !== str) throw Error('Strings should be equal.');
	});

});
