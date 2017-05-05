export const numberToHexString = (number: number): string => {
	if (number < 0) {
		number = 0xFFFFFFFF + number + 1;
	}

	return number.toString(16).toUpperCase();
};

export const cast = <T>(obj, cl): T => {
	obj.__proto__ = cl.prototype;
	return obj;
};
