import * as fs from 'fs';
import * as path from 'path';
import { Item } from './item';
import { FileLoader, Node, PropertyReader } from './fileLoader';
import { OtbmNodeType, OtbmAttribute, ItemGroup, TileFlag } from './enums';
import { WorldMap, Town } from './worldMap';
import { Tile } from './Tile';
import { Position } from './Position';

export class OTBMLoader {

	private map: WorldMap;
	private filesDirectory: string;
	private houseFile: string;
	private spawnFile: string;

	constructor(map: WorldMap) {
		this.map = map;
	}

	public load(mapName: string): boolean {
		this.filesDirectory = path.join(mapName, '..');

		const mapFileName = mapName + '.otbm';
		if (!fs.existsSync(mapFileName))
			throw Error(`${mapFileName} doesn't exist.`);

		if (!this.loadOTBM(mapFileName))
			throw Error(`Couldn't load ${mapFileName}.`);

		const spawnFile = path.join(this.filesDirectory, this.spawnFile);
		if (!fs.existsSync(spawnFile))
			throw Error(`${spawnFile} doesn't exist.`);

		if (!this.loadSpawns(spawnFile))
			throw Error(`Couldn't load ${spawnFile}.`);

		const houseFile = path.join(this.filesDirectory, this.houseFile);
		if (!fs.existsSync(houseFile))
			throw Error(`${houseFile} doesn't exist.`);

		if (!this.loadHouses(houseFile))
			throw Error(`Couldn't load ${houseFile}.`);

		return true;
	}

	private loadOTBM(fileName: string): boolean {
		const fileLoader = new FileLoader();
		fileLoader.openFile(fileName); // add file exists check

		let node = fileLoader.getRootNode();
		const props = new PropertyReader(0);

		if (!fileLoader.getProps(node, props))
			return false;

		const version = props.readUInt32();
		const width = props.readUInt16();
		const height = props.readUInt16();
		const majorVersionItems = props.readUInt32();
		const minorVersionItems = props.readUInt32();

		node = node.child;

		if (node.type !== OtbmNodeType.MapData)
			return false;

		if (!fileLoader.getProps(node, props))
			return false;

		while (props.canRead(1)) {
			const attr = props.readUInt8();

			switch (attr) {
				case OtbmAttribute.Description: {
					this.map.description = props.readString();
					break;
				} case OtbmAttribute.ExtSpawnFile: {
					this.spawnFile = props.readString();
					break;
				} case OtbmAttribute.ExtHouseFile: {
					this.houseFile = props.readString();
					break;
				} default: {
					return false;
				}
			}
		}

		let nodeMapData: Node = node.child;

		while (nodeMapData) {
			switch (nodeMapData.type) {
				case OtbmNodeType.TileArea:
					if (!this.parseTileArea(fileLoader, nodeMapData))
						return false;
					break;
				case OtbmNodeType.Towns:
					if (!this.parseTowns(fileLoader, nodeMapData))
						return false;
					break;
			}
			nodeMapData = nodeMapData.next;
		}

		return true;
	}

	private parseTileArea(fileLoader: FileLoader, node: Node): boolean {
		const props = new PropertyReader(0);

		if (!fileLoader.getProps(node, props))
			return false;

		const baseX = props.readUInt16();
		const baseY = props.readUInt16();
		const baseZ = props.readUInt8();

		let nodeTile = node.child;

		while (nodeTile) {
			if (nodeTile.type === OtbmNodeType.Tile || nodeTile.type === OtbmNodeType.HouseTile) {
				fileLoader.getProps(nodeTile, props);

				const tile: Tile = new Tile();
				const tilePosition: Position = new Position(baseX + props.readUInt8(), baseY + props.readUInt8(), baseZ);
				tile.setPosition(tilePosition);

				if (nodeTile.type === OtbmNodeType.HouseTile)
					tile.houseID = props.readUInt32();

				while (props.canRead(1)) {
					const attribute = props.readUInt8();

					switch (attribute) {
						case OtbmAttribute.TileFlags: {
							const flags = props.readUInt32();
							if ((flags & TileFlag.ProtectionZone) == TileFlag.ProtectionZone) {
								tile.isProtectionZone = true;
							}
							else if ((flags & TileFlag.NoPvpZone) == TileFlag.NoPvpZone) {
								tile.isNoPvpZone = true;
							}
							else if ((flags & TileFlag.PvpZone) == TileFlag.PvpZone) {
								tile.isPvpZone = true;
							}

							if ((flags & TileFlag.NoLogout) == TileFlag.NoLogout) {
								tile.isNoLogoutZone = true;
							}

							if ((flags & TileFlag.Refresh) == TileFlag.Refresh) {
								// TODO: Warn about house
								tile.isRefreshZone = true;
							}
							break;
						} case OtbmAttribute.Item: {
							const itemId = props.readUInt16();
							const item = Item.create(itemId);

							// TODO: if isHouseTile && !item.Info.IsMoveable

							tile.addItem(item);
							break;
						} default: {
							return false;
						}
					}
				}
				let nodeItem: Node = nodeTile.child;

				while (nodeItem) {
					if (nodeItem.type !== OtbmNodeType.Item)
						return false;

					if (!fileLoader.getProps(nodeItem, props))
						return false;

					const itemId = props.readUInt16();
					const item = Item.create(itemId);
					tile.addItem(item);

					nodeItem = nodeItem.next;
				}
				this.map.setTile(tile);
			}
			nodeTile = nodeTile.next;
		}

		return true;
	}

	private parseTowns(fileLoader: FileLoader, node: Node): boolean {
		const props: PropertyReader = new PropertyReader(0);
		let nodeTown = node.child;

		while (nodeTown) {
			if (!fileLoader.getProps(nodeTown, props))
				return false;

			const townID = props.readUInt32();
			const townName = props.readString();
			const townTempleX = props.readUInt16();
			const townTempleY = props.readUInt16();
			const townTempleZ = props.readUInt8();

			const templeLocation: Position = new Position(townTempleX, townTempleY, townTempleZ);
			const town: Town = new Town(townID, townName, templeLocation);

			this.map.towns.add(town);

			nodeTown = nodeTown.next;
		}

		return true;
	}

	private loadSpawns(fileName: string): boolean {
		return true;
	}

	private loadHouses(fileName: string): boolean {
		return true;
	}
}
