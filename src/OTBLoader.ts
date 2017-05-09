import * as fs from 'fs';
import * as xmlParser from 'xml2json';
import { FileLoader, Node, PropertyReader } from './fileLoader';
import { ItemType, ItemFlags, XMLItem, Items } from './Item';
import { ItemFlag, ItemAttribute, ItemTypes, ItemGroup } from './enums';

export class OTBLoader {

	public majorVersion: number;
	public minorVersion: number;
	public buildNumber: number;

	private fileLoader: FileLoader;
	private itemsByServerID: Map<number, ItemType>;

	constructor() {
		this.itemsByServerID = new Map<number, ItemType>();
	}

	private loadOTB(fileName: string): boolean {
		const fileLoader = new FileLoader();
		fileLoader.openFile(fileName);

		let node = fileLoader.getRootNode();
		const props = new PropertyReader(0); // fake init

		if (fileLoader.getProps(node, props)) {
			const flags = props.readUInt32();
			const attr = props.readInt8();
			if (attr === 0x01) {
				const datalen = props.readInt16();
				if (datalen !== 140)
					return false;

				this.majorVersion = props.readUInt32();
				this.minorVersion = props.readUInt32();
				this.buildNumber = props.readUInt32();
			}
		}

		node = node.child;

		while (node) {
			if (!fileLoader.getProps(node, props))
				return false;

			const flags = new ItemFlags(props.readUInt32());
			const item: ItemType = new ItemType();
			item.group = node.type;

			switch (item.group) {
				case ItemGroup.ITEM_GROUP_CONTAINER:
					item.type = ItemTypes.ITEM_TYPE_CONTAINER;
					break;
				case ItemGroup.ITEM_GROUP_DOOR:
					//not used
					item.type = ItemTypes.ITEM_TYPE_DOOR;
					break;
				case ItemGroup.ITEM_GROUP_MAGICFIELD:
					//not used
					item.type = ItemTypes.ITEM_TYPE_MAGICFIELD;
					break;
				case ItemGroup.ITEM_GROUP_TELEPORT:
					//not used
					item.type = ItemTypes.ITEM_TYPE_TELEPORT;
					break;
				case ItemGroup.ITEM_GROUP_NONE:
				case ItemGroup.ITEM_GROUP_GROUND:
				case ItemGroup.ITEM_GROUP_SPLASH:
				case ItemGroup.ITEM_GROUP_FLUID:
				case ItemGroup.ITEM_GROUP_CHARGES:
				case ItemGroup.ITEM_GROUP_DEPRECATED:
					break;
				default:
					return false;
			}

			while (props.canRead(1)) {
				const attr = props.readInt8();
				const dataLen = props.readUInt16();

				switch (attr) {
					case ItemAttribute.SERVERID: {
						let serverID = props.readUInt16();

						if (serverID > 30000 && serverID < 30100) {
							serverID -= 30000;
						}

						item.serverID = serverID
						break;
					} case ItemAttribute.CLIENTID: {
						item.clientID = props.readUInt16();
						break;
					} case ItemAttribute.SPEED: {
						item.speed = props.readUInt16();
						break;
					} case ItemAttribute.LIGHT2: {
						item.lightInfo.level = props.readUInt16();
						item.lightInfo.color = props.readUInt16();
						break;
					} case ItemAttribute.TOPORDER: {
						item.alwaysOnTopOrder = props.readUInt8();
						break;
					} case ItemAttribute.WAREID: {
						item.wareID = props.readUInt16();
						break;
					} default: {
						props.readBytes(dataLen);
						break;
					}
				}
			}

			this.parseFlags(item, flags);

			const serverID = item.serverID;
			if (serverID)
				this.itemsByServerID.set(serverID, item);
			node = node.next;
		}

		return true;
	}

	private parseFlags(item: ItemType, flags: ItemFlags) {
		item.isBlocking = flags.hasFlag(ItemFlag.BlocksSolid);
		item.isProjectileBlocking = flags.hasFlag(ItemFlag.BlocksProjectile);
		item.isPathBlocking = flags.hasFlag(ItemFlag.BlocksPathFinding);
		item.hasHeight = flags.hasFlag(ItemFlag.HasHeight);
		item.isUseable = flags.hasFlag(ItemFlag.Useable);
		item.isPickupable = flags.hasFlag(ItemFlag.Pickupable);
		item.isMoveable = flags.hasFlag(ItemFlag.Moveable);
		item.isStackable = flags.hasFlag(ItemFlag.Stackable);
		item.isAlwaysOnTop = flags.hasFlag(ItemFlag.AlwaysOnTop);
		item.isVertical = flags.hasFlag(ItemFlag.Vertical);
		item.isHorizontal = flags.hasFlag(ItemFlag.Horizontal);
		item.isHangable = flags.hasFlag(ItemFlag.Hangable);
		item.isDistanceReadable = flags.hasFlag(ItemFlag.AllowDistanceRead);
		item.isRotatable = flags.hasFlag(ItemFlag.Rotatable);
		item.isReadable = flags.hasFlag(ItemFlag.Readable);
		item.hasClientCharges = flags.hasFlag(ItemFlag.ClientCharges);
		item.canLookThrough = flags.hasFlag(ItemFlag.LookThrough);
		item.isAnimated = flags.hasFlag(ItemFlag.Animated);
	}

	public loadXML(fileName: string): boolean {
		const fileContent = fs.readFileSync(fileName).toString();
		const json = xmlParser.toJson(fileContent);
		const items = JSON.parse(json).items.item;
		const length = items.length;

		for (let i = 0; i < length; i++) {
			const xmlItem = new XMLItem(items[i]);

			if (xmlItem.isValid()) {
				const item: ItemType = this.itemsByServerID.get(xmlItem.getServerID());
				if (item) {
					item.extend(xmlItem);
				} else {
					// handle scenerion where item is not known in items.otb
				}
			} else {
				// handle xml item without id
			}
		}

		return true;
	}

	public loadItems(directory: string): boolean {
		const otbFileName = directory + '.otb';
		const xmlFileName = directory + '.xml';

		if (!fs.existsSync(otbFileName))
			throw Error(`${otbFileName} doesn't exist.`);

		if (!fs.existsSync(xmlFileName))
			throw Error(`${xmlFileName} doesn't exist.`);

		if (!this.loadOTB(otbFileName))
			throw Error(`Couldn't load ${otbFileName}.`);

		if (!this.loadXML(xmlFileName))
			throw Error(`Couldn't load ${xmlFileName}.`);

		for (let [key, itemType] of this.itemsByServerID)
			Items.addItemType(itemType);

		return true;
	}
}