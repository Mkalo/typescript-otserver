export interface uint8 {}

export class NumericType {

  static getUInt8 (num: number): number {
    return num & 255;
  }

  static getUInt16 (num: number): number {
    return num & 65535;
  }

  static getUInt32 (num: number): number {
    return num >>> 0;
  }

  static getInt8 (num: number): number {
    return (num << 24) >> 24;
  }

  static getInt16 (num: number): number {
    return (num << 16) >> 16;
  }

  static getInt32 (num: number): number {
    return num | 0;
  }

}
