import { NumericType } from "./ctypes";

export class NetworkMessage {
  dataBuffer: Buffer;
  position: number;

  constructor(size?: number) {
    this.dataBuffer = Buffer.alloc(size || 24590, 0, "utf8");
    this.position = 0;
  }

  getLength(): number {
    return this.position;
  }

  getOutputBuffer(): Buffer {
    return this.dataBuffer;
  }

  canAdd(bytes: number): boolean {
    return this.position + bytes - 1 < this.dataBuffer.length;
  }

  addUint8(value: number) {
    if (!this.canAdd(1)) {
      return;
    }

    this.position = this.dataBuffer.writeUInt8(NumericType.getUint8(value), this.position);
  }

  addUint16(value: number) {
    if (!this.canAdd(2)) {
      return;
    }

    this.position = this.dataBuffer.writeUInt16LE(NumericType.getUint16(value), this.position);
  }

  addUint32(value: number) {
    if (!this.canAdd(4)) {
      return;
    }

    this.position = this.dataBuffer.writeUInt32LE(NumericType.getUint32(value), this.position);
  }

  addInt8(value: number) {
    if (!this.canAdd(1)) {
      return;
    }

    this.position = this.dataBuffer.writeInt8(NumericType.getInt8(value), this.position);
  }

  addInt16(value: number) {
    if (!this.canAdd(2)) {
      return;
    }

    this.position = this.dataBuffer.writeInt16LE(NumericType.getInt16(value), this.position);
  }

  addInt32(value: number) {
    if (!this.canAdd(4)) {
      return;
    }

    this.position = this.dataBuffer.writeInt32LE(NumericType.getInt32(value), this.position);
  }

  addString(value: string) {
    let size: number = value.length;
    if (!this.canAdd(size + 2) || size > 8192) {
      return;
    }

    this.addUint16(size);
    this.position += this.dataBuffer.write(value, this.position, value.length);
  }

  addPaddingBytes(bytes: number) {
    for(var i = 0; i < bytes; i++) {
      this.addUint8(0x33);
    }
  }

}