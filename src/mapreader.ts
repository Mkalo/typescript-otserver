import * as fs from 'fs';
import { Binary } from './binary';


const getItemById = (id) => {
	// :|
};

class Item {
	item: any;
	id: number;
	count: number;

	constructor(id) {
		if (typeof id !== "number") throw Error("This function requires id as first argument.");

		this.item = getItemById(id);
		this.id = id;
		this.count = 0;
	}

	getStackPriority() {
		if (this.isGround())
			return 0;
		else if (this.isGroundBorder())
			return 1;
		else if (this.isOnBottom())
			return 2;
		else if (this.isOnTop())
			return 3;
		else
			return 5; // normal items
	}

	getId() {
		return this.id;
	}

	_getAttributes() {
		return this.item.attributes || {};
	}

	isStackable() {
		return this.item && !!this._getAttributes().stackable;
	}

	isFluidContainer() {
		return this.item && !!this._getAttributes().fluidContainer;
	}

	isSplash() {
		return this.item && !!this._getAttributes().splash;
	}

	isChargeable() {
		return this.isStackable();//return this.item && !!this._getAttributes().chargeable;
	}

	isAnimated() {
		try {
			const animations = this.item.frameGroups[0].spriteInfo.animations;
			return this.item && animations.length > 0;
		} catch (e) {
			return false;
		}
	}

	// setCountOrSubType() {
	// 	return ;
	// }

	isGround() {
		const a = this._getAttributes();
		return !!a.ground;
	}

	isGroundBorder() {
		const a = this._getAttributes();
		return !!a.groundBorder;
	};

	isOnBottom() {
		const a = this._getAttributes();
		return !!a.bottom;
	};

	isOnTop() {
		const a = this._getAttributes();
		return !!a.top;
	};

	isMapElement() {
		const a = this._getAttributes();
		return this.isGround() || this.isSplash() || !!a.groundBorder || !!a.bottom || !!a.top;
	}

	static isItem(item) {
		return (item instanceof Item);
	}
}

const NODE_START = 0xfe;
const NODE_END = 0xff;
const NODE_ESPACE = 0xfd;

enum MAP_VERSION {
	MAP_OTBM_UNKNOWN = -1,
	MAP_OTBM_1 = 0,
	MAP_OTBM_2 = 1,
	MAP_OTBM_3 = 2,
	MAP_OTBM_4 = 3,
};

enum ITEM_ATTRIBUTE {
	OTBM_ATTR_DESCRIPTION = 1,
	OTBM_ATTR_EXT_FILE = 2,
	OTBM_ATTR_TILE_FLAGS = 3,
	OTBM_ATTR_ACTION_ID = 4,
	OTBM_ATTR_UNIQUE_ID = 5,
	OTBM_ATTR_TEXT = 6,
	OTBM_ATTR_DESC = 7,
	OTBM_ATTR_TELE_DEST = 8,
	OTBM_ATTR_ITEM = 9,
	OTBM_ATTR_DEPOT_ID = 10,
	OTBM_ATTR_EXT_SPAWN_FILE = 11,
	OTBM_ATTR_RUNE_CHARGES = 12,
	OTBM_ATTR_EXT_HOUSE_FILE = 13,
	OTBM_ATTR_HOUSEDOORID = 14,
	OTBM_ATTR_COUNT = 15,
	OTBM_ATTR_DURATION = 16,
	OTBM_ATTR_DECAYING_STATE = 17,
	OTBM_ATTR_WRITTENDATE = 18,
	OTBM_ATTR_WRITTENBY = 19,
	OTBM_ATTR_SLEEPERGUID = 20,
	OTBM_ATTR_SLEEPSTART = 21,
	OTBM_ATTR_CHARGES = 22,

	OTBM_ATTR_ATTRIBUTE_MAP = 128
};

enum NODE_TYPE  {
	OTBM_ATTR_FIRST_INFO = 0,
	OTBM_ROOTV1 = 1,
	OTBM_MAP_DATA = 2,
	OTBM_ITEM_DEF = 3,
	OTBM_TILE_AREA = 4,
	OTBM_TILE = 5,
	OTBM_ITEM = 6,
	OTBM_TILE_SQUARE = 7,
	OTBM_TILE_REF = 8,
	OTBM_SPAWNS = 9,
	OTBM_SPAWN_AREA = 10,
	OTBM_MONSTER = 11,
	OTBM_TOWNS = 12,
	OTBM_TOWN = 13,
	OTBM_HOUSETILE = 14,
	OTBM_WAYPOINTS = 15,
	OTBM_WAYPOINT = 16,
};

class Position {
	private x: number;
	private y: number;
	private z: number;
	
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

export class MapReader {
	private map: Binary;
	private version: number;

	constructor(filename?: string) {
		if (filename)
			this.load(filename);
	}

	public load(filename: string) {
		this.map = new Binary(fs.readFileSync(filename));
	}

	// private getCurrentNode(parseStack) {
	// 	return parseStack[parseStack.length - 1];
	// }

	// public parseTree() {
	// 	this.map.readUInt8();
	// 	this.map.readUInt8();
	// 	this.map.readUInt8();
	// 	this.map.readUInt8(); // it's OTB::Identifier{{'O', 'T', 'B', 'M'}} ???????

	// 	const parseStack = [];

	// 	if (this.map.readUInt8() !== NODE_START) {
	// 		throw Error("Invalid OTBM format.");
	// 	}

	// 	const root = {
	// 		type: this.map.readUInt8(),
	// 		begin: this.map.position++
	// 	};

	// 	parseStack.push(root);

	// 	while (this.map.canRead(1)) {
	// 		const nodeType = this.map.readUInt8();
			
	// 		switch (nodeType) {
	// 			case NODE_START: {
	// 				const currentNode = this.getCurrentNode(parseStack);
	// 				if (!currentNode) throw Error("Invalid OTBM format. 1");

	// 				if (!currentNode.begin) {
	// 					currentNode.end = this.map.position;
	// 				}

	// 				// this.map.position++
	// 				// if (!this.map.canRead(1))
	// 				// 	throw Error("Invalid OTBM format. 3");

	// 				const child = {
	// 					type: this.map.readUInt8(),
	// 					begin: this.map.position + 4
	// 				};

	// 				parseStack.push(child);
	// 				break;
	// 			} case NODE_END: {
	// 				const currentNode = this.getCurrentNode(parseStack);
	// 				currentNode.end = this.map.position;

	// 				parseStack.pop();
	// 				break;
	// 			} case NODE_ESPACE: {
	// 				const pos = this.map.position;
	// 				if (this.map.canRead(1)) {
	// 					console.log(parseStack);
	// 					throw Error("Invalid OTBM format2.");
	// 				}
	// 				break;
	// 			} default: {
	// 				break;
	// 			}
	// 		}
	// 	}

	// 	console.log(parseStack);
	// }

	public parse() {
		this.map.readUInt8();
		this.map.readUInt8();
		this.map.readUInt8();
		this.map.readUInt8(); // it's OTB::Identifier{{'O', 'T', 'B', 'M'}} ???????

		while (this.map.canRead(1)) {
			let node;
			try {
				node = this.readNode();
				console.log("NODE:", node);
			} catch(e) {
				return console.error("Couldn't parse OTBM map.");
			}

			switch (node) {
				case NODE_TYPE.OTBM_ATTR_FIRST_INFO:
					this.parseFirstInfo();
					break;
				case NODE_TYPE.OTBM_MAP_DATA:
					this.parseMapData();
					break;
				case NODE_TYPE.OTBM_TILE_AREA:
					this.parseTileArea();
					break;
				case NODE_TYPE.OTBM_HOUSETILE:
				case NODE_TYPE.OTBM_TILE:
					this.parseTile(node);
					break;
				default:
					return;
			}
		}
	}

	private parseFirstInfo() {
		this.version = this.map.readInt32();

		const width = this.map.readUInt16();
		const height = this.map.readUInt16();

		const minorVersion = this.map.readUInt32();
		const majorVersion = this.map.readUInt32();

		console.log({ width, height, minorVersion, majorVersion});
	}

	private parseMapData() {
		
		this.map.readUInt8();
		const descriptionTag = this.map.readString();

		this.map.readUInt8();
		const description = this.map.readString();

		this.map.readUInt8();
		const spawnFile = this.map.readString();

		this.map.readUInt8();
		const houseFile = this.map.readString();

		console.log({ descriptionTag, description, spawnFile, houseFile });
	}

	parseTileArea() {
		const x = this.map.readUInt16();
		const y = this.map.readUInt16();
		const z = this.map.readUInt8();

		const position:Position = new Position(x, y, z);
	}

	parseTile(type) {
		const isHouseTile = type === NODE_TYPE.OTBM_HOUSETILE;

		const xOffset = this.map.readUInt8();
		const yOffset = this.map.readUInt8();

		const houseId = isHouseTile ? this.map.readUInt32() : -1;

		// const isMapFlags = this.map.readUInt8() === ITEM_ATTRIBUTE.OTBM_ATTR_TILE_FLAGS;
		
		let attribute = this.map.readUInt8();
		const tile = [];

		switch (attribute) {
			case ITEM_ATTRIBUTE.OTBM_ATTR_TILE_FLAGS: {
				let flags = this.map.readUInt32();
				console.log("FLAGS:", flags);
				// tile ->setMapFlags(flags);
				break;	
			} case ITEM_ATTRIBUTE.OTBM_ATTR_ITEM: {
				const id = this.map.readUInt16();
				const count = 0;

				// const ItemType& iType = g_items[id];
				const item: Item = new Item(id);
				if (this.version == MAP_VERSION.MAP_OTBM_1) {
					if (item.isStackable() || item.isSplash() || item.isFluidContainer()) {
						item.count = this.map.readUInt8();
					}
				}

				if (!item) {
					console.warn("Invalid item at tile %d:%d:%d", xOffset, yOffset);
				}
				tile.push(item);
				// tile ->addItem(item);
				break;
			} default: {
				console.warn("Unknown tile attribute at %d:%d", xOffset, yOffset);
				break;
			}
		}
		
		// let mapFlags = null
		// if (isMapFlags) {
		// 	mapFlags = this.map.readUInt32();
		// } else {
		// 	this.map.position--; // if not go back
		// }

		// // console.log(isMapFlags);

		// console.log(this.map.readUInt8());
		// console.log(this.map.readUInt8());
		// console.log(this.map.readUInt8());
		// console.log(this.map.readUInt8());
		// console.log(this.map.readUInt8());

		console.log({ xOffset, yOffset });
	}

	private readNode() {
		const startValue = this.map.readUInt8();
		if (startValue !== NODE_START)
			throw Error("Invalid otbm format." + startValue);

		const nodeType = this.map.readUInt8();
		return nodeType;
	}
}
