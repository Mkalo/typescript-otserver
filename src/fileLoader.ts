import { Binary } from './binary';
import { NodeType } from './enums';
import * as fs from 'fs';

export class Node {
	public start: number = 0;
	public propSize: number = 0;
	public type: number = 0;
	public next: Node;
	public child: Node;
}

export class FileLoader {

	private root: Node;
	private fileContent: Buffer;
	private binaryReader: Binary;

	public getRootNode(): Node {
		return this.root;
	}

	public openFile(fileName: string): boolean {
		this.fileContent = fs.readFileSync(fileName);
		this.binaryReader = new Binary(this.fileContent);

		const version = this.binaryReader.readUInt32();

		this.root = new Node();
		this.root.start = 4;

		if (this.binaryReader.readUInt8() === NodeType.Start)
			return this.parseNode(this.root);

		return false;
	}

	public parseNode(node: Node): boolean {
		let currentNode: Node = node;

		while (this.binaryReader.canRead(1)) {
			currentNode.type = this.binaryReader.readUInt8();;
			let setPropSize: boolean = false;

			while (this.binaryReader.canRead(1)) {
				let val = this.binaryReader.readUInt8();

				if (val === NodeType.Start) {
					const childNode: Node = new Node();
					childNode.start = this.binaryReader.getPosition();
					setPropSize = true;
					currentNode.propSize = this.binaryReader.getPosition() - currentNode.start - 2;
					currentNode.child = childNode;
					if (!this.parseNode(childNode)) {
						return false;
					}
				} else if (val === NodeType.End) {
					if (!setPropSize) {
						currentNode.propSize = this.binaryReader.getPosition() - currentNode.start - 2;
					}

					if (this.binaryReader.canRead(1)) {
						val = this.binaryReader.readUInt8();
						if (val === NodeType.Start) {
							const nextNode: Node = new Node();
							nextNode.start = this.binaryReader.getPosition();
							currentNode.next = nextNode;
							currentNode = nextNode;
							break;
						} else if (val === NodeType.End) {
							const currentPosition = this.binaryReader.getPosition();
							this.binaryReader.setPosition(currentPosition - 1);
							return true;
						} else {
							// bad format
							return false;
						}
					} else {
						// end of file?
						return true;
					}
				} else if (val === NodeType.Escape) {
					this.binaryReader.readInt8();
				}
			}
		}
	}

	private _getProps(node: Node): { buffer: Buffer, size: number } {
		const buffer = new Buffer(node.propSize);
		this.binaryReader.setPosition(node.start + 1);

		const startPosition = this.binaryReader.getPosition();
		this.binaryReader.setPosition(startPosition + node.propSize);
		const endPosition = this.binaryReader.getPosition();
		this.binaryReader.getBuffer().copy(buffer, 0, startPosition, endPosition);

		let j = 0;
		let escaped = false;

		for (let i = 0; i < node.propSize; ++i, ++j) {
			if (buffer[i] === NodeType.Escape) {
				++i;
				buffer[j] = buffer[i];
				escaped = true;
			} else if (escaped) {
				buffer[j] = buffer[i];
			}
		}

		return { buffer: buffer, size: j };
	}

	public getProps(node: Node, props: PropertyReader): boolean {
		const _props = this._getProps(node);

		const size = _props.size;
		const buffer = _props.buffer;

		const newBuffer = new Buffer(size);
		buffer.copy(newBuffer, 0, 0, size);

		props.reInitalize(newBuffer);

		return true;
	}

}

export class PropertyReader extends Binary {

	public reInitalize(buffer: Buffer) {
		this.setPosition(0);
		this.setBuffer(buffer);
	}
	
}
