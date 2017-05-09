import * as fs from 'fs';
import * as path from 'path';
import { Item } from './Item';
import { FileLoader, Node, PropertyReader } from './fileLoader';
import { OtbmNodeType, OtbmAttribute, ItemGroup, TileFlag, TileFlags } from './enums';
import { WorldMap } from './worldMap';
import { Town } from './Town';
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

				let isHouseTile = false;
				let tile: Tile = null;
				let groundItem: Item = null;

				let tileFlags: TileFlag = TileFlag.None;
				const tilePosition: Position = new Position(baseX + props.readUInt8(), baseY + props.readUInt8(), baseZ);
				// tile.setPosition(tilePosition);

				if (nodeTile.type === OtbmNodeType.HouseTile) {
					tile.houseID = props.readUInt32();
					isHouseTile = true;
					// add house somewhere
				}

				while (props.canRead(1)) {
					const attribute = props.readUInt8();

					switch (attribute) {
						case OtbmAttribute.TileFlags: {
							const flags = props.readUInt32();
							if ((flags & TileFlag.ProtectionZone) == TileFlag.ProtectionZone) {
								tileFlags |= TileFlags.TILESTATE_PROTECTIONZONE;
							}
							else if ((flags & TileFlag.NoPvpZone) == TileFlag.NoPvpZone) {
								tileFlags |= TileFlags.TILESTATE_NOPVPZONE;
							}
							else if ((flags & TileFlag.PvpZone) == TileFlag.PvpZone) {
								tileFlags |= TileFlags.TILESTATE_PVPZONE;
							}

							if ((flags & TileFlag.NoLogout) == TileFlag.NoLogout) {
								tileFlags |= TileFlags.TILESTATE_NOLOGOUT;
							}

							break;
						} case OtbmAttribute.Item: {
							const itemId = props.readUInt16();
							let item = Item.create(itemId);

							if (!item) {
								console.error('Failed to create item');
								return false;
							}

							if (isHouseTile && item.isMoveable()) {
								const houseId = -1; // house.getId();
								console.log(`[Warning - IOMap::loadMap] Moveable item with ID: ${item.getID()}, in house: ${houseId}, at position ${tilePosition.toString()}.`);
								item = null;
							} else {
								if (item.getItemCount() <= 0) {
									item.setItemCount(1);
								}

								if (tile) {
									tile.internalAddThing(item);
									item.startDecaying();
									item.setLoadedFromMap(true);
								} else if (item.isGround()) {
									groundItem = null;
									groundItem = item;
								} else {
									tile = new Tile(); // CHANGE IT THERE AFTER STATIC TILE AND OTHER THINGS IMPLEMENTATION
									tile.setGround(groundItem);
									tile.addThing(item);
									tile.setPosition(tilePosition);

									tile.internalAddThing(item);
									item.startDecaying();
									item.setLoadedFromMap(true);
								}
							}
							
							break;
						} default: {
							return false;
						}
					}
				}
				let nodeItem: Node = nodeTile.child;

				while (nodeItem) {
					if (nodeItem.type !== OtbmNodeType.Item) {
						console.log(`${tilePosition.toString()} Unknown node type.`);
						return false;
					}

					if (!fileLoader.getProps(nodeItem, props))
						return false;

					const itemId = props.readUInt16();
					let item = Item.create(itemId);
					// tile.addThing(item);

					if (!item.unserializeItemNode(fileLoader, nodeItem, props)) {
						console.log(`${tilePosition.toString()} Failed to load item ${item.getID()}.`);
						return false;
					}

					if (isHouseTile && item.isMoveable()) {
						const houseId = -1; // house.getId();
						console.log(`[Warning - IOMap::loadMap] Moveable item with ID: ${item.getID()}, in house: ${houseId}, at position ${tilePosition.toString()}.`);
						item = null;
					} else {
						if (item.getItemCount() <= 0) {
							item.setItemCount(1);
						}

						if (tile) {
							tile.internalAddThing(item);
							item.startDecaying();
							item.setLoadedFromMap(true);
						} else {
							tile = new Tile(); // CHANGE IT THERE AFTER STATIC TILE AND OTHER THINGS IMPLEMENTATION
							tile.setGround(groundItem);
							tile.addThing(item);
							tile.setPosition(tilePosition);

							item.startDecaying();
							item.setLoadedFromMap(true);
						}
					}
					nodeItem = nodeItem.next;
				}

				if (!tile) {
					tile = new Tile();
					tile.setGround(groundItem);
					tile.setPosition(tilePosition);
				}

				tile.setFlag(tileFlags);
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
