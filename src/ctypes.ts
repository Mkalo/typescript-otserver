export class NumericType {

	public static getUInt8(num: number): number {
		return num & 255;
	}

	public static getUInt16(num: number): number {
		return num & 65535;
	}

	public static getUInt32(num: number): number {
		return num >>> 0;
	}

	public static getInt8(num: number): number {
		return (num << 24) >> 24;
	}

	public static getInt16(num: number): number {
		return (num << 16) >> 16;
	}

	public static getInt32(num: number): number {
		return num | 0;
	}

}
