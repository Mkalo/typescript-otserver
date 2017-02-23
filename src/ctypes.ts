export interface uint8 {}

export class NumericType {

  static getUint8 (num: number): number {
    return num & 255;
  }

  static getUint16 (num: number): number {
    return num & 65535;
  }

  static getUint32 (num: number): number {
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
