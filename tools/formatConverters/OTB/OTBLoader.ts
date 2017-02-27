import * as fs from 'fs';
import * as xmlParser from 'xml2json';
import { FileLoader, Node, PropertyReader } from '../fileLoader';
import { ItemType, ItemFlags, XMLItem, Items } from 'src/item';
import { ItemFlag } from 'src/enums';

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

			while (props.canRead(1)) {
				const attr = props.readInt8();
				const dataLen = props.readUInt16();

				switch (attr) {
					case 16: {
						item.serverID = props.readUInt16();
						break;
					} case 17: {
						item.clientID = props.readUInt16();
						break;
					} case 20: {
						item.speed = props.readUInt16();
						break;
					} case 43: {
						item.topOrder = props.readUInt8();
						break;
					} default: {
						props.readBytes(dataLen);
						break;
					}
				}
			}

			const serverID = item.serverID;
			if (serverID)
				this.itemsByServerID.set(serverID, item);
			node = node.next;
		}

		return true;
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