export const hasBitSet = (flag: number, flags: number): boolean => {
	return (flags & flag) !== 0;
};
