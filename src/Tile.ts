import { Position } from './Position';
import { Creature } from './Creature';
import { Cylinder } from './Cylinder';
import { Item, Items, ItemList, ItemType } from './Item';
import { Thing } from './Thing';
import { Player } from './Player';
import { MagicField } from './MagicField';
import { Combat } from './Combat';
import { TileFlag, ZoneType, ReturnValue, CylinderLink, CylinderFlag, ItemProperty, ItemAttributeType } from './enums';
import { hasBitSet } from './tools';
import { g_game, g_map } from './otserv';
import { TrashHolder } from './TrashHolder';
import { Teleport } from './Teleport';
import { Mailbox } from './Mailbox';
import { BedItem } from './Bed';

type CreatureVector = Array<Creature>;
type ItemVector = Array<Item>;
type SpectatorVector = Array<Creature>;

class TileItemVector extends Array<Item> {
	private downItemCount: number = 0;

	public getTopItemCount(): number {
		return this.length - this.downItemCount;
	}

	public getDownItemCount(): number {
		return this.downItemCount;
	}

	public getTopTopItem(): Item {
		if (this.getTopItemCount() === 0) {
			return null;
		}
		return this[this.length - 1]; // OR -2 IDK
	}

	public getTopDownItem(): Item {
		if (this.downItemCount === 0) {
			return null;
		}
		return this[0];
	}

	public addDownItemCount(increment: number) {
		this.downItemCount += increment;
	}

	public removeItem(item: Item): boolean {
		const index = this.indexOf(item);
		if (index === -1)
			return false;
		this.splice(index, 1);
		return true;
	}
};


export class Tile extends Cylinder {

	public isProtectionZone: boolean = false;
	public isNoPvpZone: boolean = false;
	public isPvpZone: boolean = false;
	public isNoLogoutZone: boolean = false;
	public isRefreshZone: boolean = false;
	public houseID: number;
	public ground: Item = null;

	private itemVector: TileItemVector = new TileItemVector();
	private creatureVector: CreatureVector = [];

	public itemList: ItemList = new ItemList();

	protected tilePos: Position;
	protected flags: number = 0;

	public getItemList(): TileItemVector {
		return this.itemVector;
	}

	public getCreatures(): CreatureVector {
		return this.creatureVector;
	}

	public getThrowRange(): number {
		return 0;
	}

	public isPushable(): boolean {
		return false;
	}

	public getFieldItem(): MagicField {
		if (!this.hasFlag(TileFlag.TILESTATE_MAGICFIELD)) {
			return null;
		}

		if (this.ground && this.ground.getMagicField()) {
			const magicField = this.ground.getMagicField();
			if (magicField) {
				return magicField;
			}
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				const magicField = item.getMagicField();
				if (magicField) {
					return magicField;
				}
			}
		}
		return null;
	}

	public getTeleportItem(): Teleport {
		if (!this.hasFlag(TileFlag.TILESTATE_TELEPORT)) {
			return null;
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				const teleport = item.getTeleport();
				if (teleport) {
					return teleport;
				}
			}
		}
		return null;
	}

	public getTrashHolder(): TrashHolder {
		if (!this.hasFlag(TileFlag.TILESTATE_TRASHHOLDER)) {
			return null;
		}

		if (this.ground) {
			const trashHolder = this.ground.getTrashHolder();
			if (trashHolder)
				return trashHolder;
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				const trashHolder = item.getTrashHolder();
				if (trashHolder) {
					return trashHolder;
				}
			}
		}

		return null;
	}

	public getMailbox(): Mailbox {
		if (!this.hasFlag(TileFlag.TILESTATE_MAILBOX)) {
			return null;
		}

		if (this.ground) {
			const mailbox = this.ground.getMailbox();
			if (mailbox)
				return mailbox;
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				const mailbox = item.getMailbox();
				if (mailbox) {
					return mailbox;
				}
			}
		}

		return null;
	}

	public getBedItem(): BedItem {
		if (!this.hasFlag(TileFlag.TILESTATE_BED)) {
			return null;
		}

		if (this.ground) {
			const bed = this.ground.getBed();
			if (bed)
				return bed;
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				const bed = item.getBed();
				if (bed) {
					return bed;
				}
			}
		}

		return null;
	}

	public getTopCreature(): Creature {
		const creatures = this.getCreatures();
		if (creatures) {
			return creatures[0] || null;
		}
		return null;
	}

	public getBottomCreature(): Creature {
		const creatures = this.getCreatures();
		if (creatures) {
			return creatures[creatures.length - 1] || null;
		}
		return null;
	}

	public getTopVisibleCreature(creature: Creature): Creature {
		const creatures = this.getCreatures();
		if (creatures) {
			if (creature) {
				const player: Player = creature.getPlayer();
				if (player && player.isAccessPlayer()) {
					return this.getTopCreature();
				}

				for (let tileCreature of creatures) {
					if (creature.canSeeCreature(tileCreature)) {
						return tileCreature;
					}
				}
			} else {
				for (let tileCreature of creatures) {
					if (!tileCreature.isInvisible()) {
						const player = tileCreature.getPlayer();
						if (!player || !player.isInGhostMode()) {
							return tileCreature;
						}
					}
				}
			}
		}
		return null;
	}

	public getBottomVisibleCreature(creature: Creature): Creature {
		const creatures = this.getCreatures();
		if (creatures) {
			if (creature) {
				const player: Player = creature.getPlayer();
				if (player && player.isAccessPlayer()) {
					return this.getBottomCreature();
				}

				for (let i = creatures.length - 1; i >= 0; i--) {
					const tileCreature = creatures[i];
					if (creature.canSeeCreature(tileCreature)) {
						return tileCreature;
					}
				}
			} else {
				for (let i = creatures.length - 1; i >= 0; i--) {
					const tileCreature = creatures[i];
					if (creature.canSeeCreature(tileCreature)) {
						return tileCreature;
					}
				}
			}
		}
		return null;
	}

	public getTopTopItem(): Item {
		const items = this.getItemList();
		return items[0] || null;
	}

	public getTopDownItem(): Item {
		const items = this.getItemList();
		return items[items.length - 1] || null;
	}

	public isMoveableBlocking(): boolean {
		return true;
	}

	public getTopVisibleThing(creature: Creature): Thing {
		return null;
	}

	public getItemByTopOrder(topOrder: number): Item {
		//topOrder:
		//1: borders
		//2: ladders, signs, splashes
		//3: doors etc
		//4: creatures
		const items = this.getItemList();
		if (items) {
			for (let i = items.length - 1; i >= 0; i--) { // not sure if this loop is correct
				const item = items[i];
				if (item.itemType.topOrder === topOrder)
					return item;
			}
		}
		return null;
	}

	public getThingCount(): number {
		let thingCount = this.getCreatureCount() + this.getItemCount();

		if (this.ground) {
			thingCount++;
		}

		return thingCount;
	}

	// 	// If these return != 0 the associated vectors are guaranteed to exists
	public getCreatureCount(): number {
		const creatures = this.getCreatures();
		if (creatures)
			return creatures.length

		return 0;
	}

	public getItemCount(): number {
		const items = this.getItemList();
		if (items)
			return items.length;
		return 0;
	}

	public getTopItemCount(): number {
		const items = this.getItemList();
		if (items)
			return items.getTopItemCount();

		return 0;
	}

	public getDownItemCount(): number {
		const items = this.getItemList();
		if (items)
			return items.getDownItemCount();

		return 0;
	}

	public hasProperty(prop: ItemProperty, exclude?: Item): boolean { // not sure if this is correct
		if (exclude) {
			if (this.ground && exclude !== this.ground && this.ground.hasProperty(prop)) {
				return true;
			}
			const items = this.getItemList();
			if (items) {
				for (let item of items) {
					if (item !== exclude && item.hasProperty(prop)) {
						return true;
					}
				}
			}

			return false;
		}

		if (this.ground && this.ground.hasProperty(prop)) {
			return true;
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				if (item.hasProperty(prop)) {
					return true;
				}
			}
		}
		return false;
	}

	public hasFlag(flag: number): boolean {
		return hasBitSet(flag, this.flags);
	}

	public setFlag(flag: number): void {
		this.flags |= flag;
	}

	public resetFlag(flag: number): void {
		this.flags &= ~flag; // ??????????????
	}

	public getZone(): ZoneType {
		if (this.hasFlag(TileFlag.TILESTATE_PROTECTIONZONE)) {
			return ZoneType.ZONE_PROTECTION;
		} else if (this.hasFlag(TileFlag.TILESTATE_NOPVPZONE)) {
			return ZoneType.ZONE_NOPVP;
		} else if (this.hasFlag(TileFlag.TILESTATE_PVPZONE)) {
			return ZoneType.ZONE_PVP;
		} else {
			return ZoneType.ZONE_NORMAL;
		}
	}

	public hasHeight(n: number): boolean {
		let height: number = 0;

		if (this.ground) {
			if (this.ground.hasProperty(ItemProperty.CONST_PROP_HASHEIGHT)) {
				++height;
			}

			if (n === height) {
				return true;
			}
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				if (item.hasProperty(ItemProperty.CONST_PROP_HASHEIGHT)) {
					++height;
				}

				if (n === height) {
					return true;
				}
			}
		}
		return false;
	}

	public getDescription(lookDistance: number): string {
		return "You dont know why, but you cant see anything!";
	}

	public getClientIndexOfCreature(player: Player, creature: Creature): number {
		let n = this.ground ? 1 : 0;

		const items = this.getItemList();
		if (items) {
			n += items.getTopItemCount();
		}

		const creatures = this.getCreatures();
		if (creatures) {
			for (let c of creatures.slice().reverse()) {
				if (c === creature) {
					return n;
				} else if (player.canSeeCreature(c)) {
					++n;
				}
			}
		}
		return -1;
	}

	public getStackposOfCreature(player: Player, creature: Creature): number {
		let n = this.ground ? 1 : 0;

		const items = this.getItemList();
		if (items) {
			n += items.getTopItemCount();
			if (n >= 10) {
				return -1;
			}
		}

		const creatures = this.getCreatures();
		if (creatures) {
			for (let c of creatures.slice().reverse()) {
				if (c === creature) {
					return n;
				} else if (player.canSeeCreature(c)) {
					if (++n >= 10) {
						return -1;
					}
				}
			}
		}
		return -1;
	}

	public getStackposOfItem(player: Player, item: Item): number {
		let n = 0;
		if (this.ground) {
			if (this.ground === item) {
				return n;
			}
			++n;
		}

		const items = this.getItemList();
		if (items) {
			if (item.itemType.isAlwaysOnTop) {
				for (let it of items) {
					if (it === item) {
						return n;
					} else if (++n == 10) {
						return -1;
					}
				}
			} else {
				n += items.getTopItemCount();
				if (n >= 10) {
					return -1;
				}
			}
		}

		const creatures = this.getCreatures();
		if (creatures) {
			for (let creature of creatures) {
				if (player.canSeeCreature(creature)) {
					if (++n >= 10) {
						return -1;
					}
				}
			}
		}

		if (items && !item.itemType.isAlwaysOnTop) {
			for (let i = items.length - 1; i >= 0; i--) {
				const it = items[i];
				if (it === item) {
					return n;
				} else if (++n >= 10) {
					return -1;
				}
			}
		}
		return -1;
	}

	// 	//cylinder implementations
	public queryAdd(index: number, thing: Thing, count: number, flags: number, actor: Creature = null): ReturnValue {
		const creature = thing.getCreature();
		if (creature) {
			if (hasBitSet(CylinderFlag.FLAG_NOLIMIT, flags)) {
				return ReturnValue.RETURNVALUE_NOERROR;
			}

			if (hasBitSet(CylinderFlag.FLAG_PATHFINDING, flags) && this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE | TileFlag.TILESTATE_TELEPORT)) {
				return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
			}

			if (this.ground === null) {
				return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
			}

			const monster = creature.getMonster();
			if (monster) {
				if (this.hasFlag(TileFlag.TILESTATE_PROTECTIONZONE | TileFlag.TILESTATE_FLOORCHANGE | TileFlag.TILESTATE_TELEPORT)) {
					return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
				}

				const creatures = this.getCreatures();
				if (monster.canPushCreatures() && !monster.isSummon()) {
					if (creatures) {
						for (let tileCreature of creatures) {
							if (tileCreature.getPlayer() && tileCreature.getPlayer().isInGhostMode()) {
								continue;
							}

							const creatureMonster = tileCreature.getMonster();
							if (!creatureMonster || !tileCreature.isPushable() ||
								(creatureMonster.isSummon() && creatureMonster.getMaster().getPlayer())) {
								return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
							}
						}
					}
				} else if (creatures && creatures.length) {
					for (let tileCreature of creatures) {
						if (!tileCreature.isInGhostMode()) {
							return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
						}
					}
				}

				if (this.hasFlag(TileFlag.TILESTATE_IMMOVABLEBLOCKSOLID)) {
					return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
				}

				if (hasBitSet(CylinderFlag.FLAG_PATHFINDING, flags) && this.hasFlag(TileFlag.TILESTATE_IMMOVABLENOFIELDBLOCKPATH)) {
					return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
				}

				if (this.hasFlag(TileFlag.TILESTATE_BLOCKSOLID) || (hasBitSet(CylinderFlag.FLAG_PATHFINDING, flags) && this.hasFlag(TileFlag.TILESTATE_NOFIELDBLOCKPATH))) {
					if (!(monster.canPushItems() || hasBitSet(CylinderFlag.FLAG_IGNOREBLOCKITEM, flags))) {
						return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
					}
				}

				const field = this.getFieldItem();
				if (field && !field.isBlocking()) {
					const combatType = field.getCombatType();

					//There is 3 options for a monster to enter a magic field
					//1) Monster is immune
					if (!monster.isImmune(combatType)) {
						//1) Monster is "strong" enough to handle the damage
						//2) Monster is already afflicated by this type of condition
						if (hasBitSet(CylinderFlag.FLAG_IGNOREFIELDDAMAGE, flags)) {
							if (!(monster.canPushItems() || monster.hasCondition(Combat.damageToConditionType(combatType)))) {
								return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
							}
						} else {
							return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
						}
					}
				}

				return ReturnValue.RETURNVALUE_NOERROR;
			}

			const creatures = this.getCreatures();
			const player = creature.getPlayer();
			if (player) {
				if (creatures && creatures.length && !hasBitSet(CylinderFlag.FLAG_IGNOREBLOCKCREATURE, flags) && !player.isAccessPlayer()) {
					for (let tileCreature of creatures) {
						if (!player.canWalkthrough(tileCreature)) {
							return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
						}
					}
				}

				if (!player.getParent() && this.hasFlag(TileFlag.TILESTATE_NOLOGOUT)) {
					//player is trying to login to a "no logout" tile
					return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
				}

				const playerTile = player.getTile();
				if (playerTile && player.isPzLocked()) {
					if (!playerTile.hasFlag(TileFlag.TILESTATE_PVPZONE)) {
						//player is trying to enter a pvp zone while being pz-locked
						if (this.hasFlag(TileFlag.TILESTATE_PVPZONE)) {
							return ReturnValue.RETURNVALUE_PLAYERISPZLOCKEDENTERPVPZONE;
						}
					} else if (!this.hasFlag(TileFlag.TILESTATE_PVPZONE)) {
						// player is trying to leave a pvp zone while being pz-locked
						return ReturnValue.RETURNVALUE_PLAYERISPZLOCKEDLEAVEPVPZONE;
					}

					if ((!playerTile.hasFlag(TileFlag.TILESTATE_NOPVPZONE) && this.hasFlag(TileFlag.TILESTATE_NOPVPZONE)) ||
						(!playerTile.hasFlag(TileFlag.TILESTATE_PROTECTIONZONE) && this.hasFlag(TileFlag.TILESTATE_PROTECTIONZONE))) {
						// player is trying to enter a non-pvp/protection zone while being pz-locked
						return ReturnValue.RETURNVALUE_PLAYERISPZLOCKED;
					}
				}
			} else if (creatures && creatures.length && !hasBitSet(CylinderFlag.FLAG_IGNOREBLOCKCREATURE, flags)) {
				for (let tileCreature of creatures) {
					if (!tileCreature.isInGhostMode()) {
						return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
					}
				}
			}

			if (!hasBitSet(CylinderFlag.FLAG_IGNOREBLOCKITEM, flags)) {
				//If the FLAG_IGNOREBLOCKITEM bit isn't set we dont have to iterate every single item
				if (this.hasFlag(TileFlag.TILESTATE_BLOCKSOLID)) {
					return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
				}
			} else {
				//FLAG_IGNOREBLOCKITEM is set
				if (this.ground) {
					const iiType = this.ground.itemType;
					iiType.isMoveable
					if (iiType.isBlocking && (!iiType.isMoveable || this.ground.hasAttribute(ItemAttributeType.ITEM_ATTRIBUTE_UNIQUEID))) {
						return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
					}
				}

				const items = this.getItemList();
				if (items) {
					for (let item of items) {
						const iiType = item.itemType;
						if (iiType.isBlocking && (!iiType.isMoveable || item.hasAttribute(ItemAttributeType.ITEM_ATTRIBUTE_UNIQUEID))) {
							return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
						}
					}
				}
			}
			// } else if (const Item* item = thing.getItem()) {
		} else if (true) {
			const item = thing.getItem(); ///////////////////////////////////////////////////////// remove this
			const items = this.getItemList();
			if (items && items.length >= 0xFFFF) {
				return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
			}

			if (hasBitSet(CylinderFlag.FLAG_NOLIMIT, flags)) {
				return ReturnValue.RETURNVALUE_NOERROR;
			}

			const itemIsHangable = item.isHangable();
			if (!this.ground && !itemIsHangable) {
				return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
			}

			const creatures = this.getCreatures();
			if (creatures && creatures.length && item.isBlocking() && !hasBitSet(CylinderFlag.FLAG_IGNOREBLOCKCREATURE, flags)) {
				for (const tileCreature of creatures) {
					if (!tileCreature.isInGhostMode()) {
						return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
					}
				}
			}

			if (itemIsHangable && this.hasFlag(TileFlag.TILESTATE_SUPPORTS_HANGABLE)) {
				if (items) {
					for (const tileItem of items) {
						if (tileItem.isHangable()) {
							return ReturnValue.RETURNVALUE_NEEDEXCHANGE;
						}
					}
				}
			} else {
				if (this.ground) {
					const iiType = this.ground.itemType;
					if (iiType.isBlocking) {
						if (!iiType.isPickupable || item.isMagicField() || item.isBlocking()) {
							if (!item.isPickupable()) {
								return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
							}

							if (!iiType.hasHeight || iiType.isPickupable /*|| iiType.isBed() */) { // TO DO......
								return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
							}
						}
					}
				}

				if (items) {
					for (const tileItem of items) {
						const iiType = tileItem.itemType;
						if (!iiType.isBlocking) {
							continue;
						}

						if (iiType.isPickupable && !item.isMagicField() && !item.isBlocking()) {
							continue;
						}

						if (!item.isPickupable()) {
							return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
						}

						if (!iiType.hasHeight || iiType.isPickupable /*|| iiType.isBed() */) { // TO DO......
							return ReturnValue.RETURNVALUE_NOTENOUGHROOM;
						}
					}
				}
			}
		}
		return ReturnValue.RETURNVALUE_NOERROR;
	}

	public queryMaxCount(index: number, thing: Thing, count: number, maxQueryCount: { value: number }, flags: number): ReturnValue {
		maxQueryCount.value = Math.max(1, count > 0xFFFFFFFF ? 0 : count); //??
		return ReturnValue.RETURNVALUE_NOERROR;
	}

	public queryRemove(thing: Thing, count: number, flags: number): ReturnValue {
		const index = this.getThingIndex(thing);
		if (index === -1) {
			return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
		}

		const item = thing.getItem();
		if (!item) {
			return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
		}

		if (count === 0 || (item.isStackable() && count > item.getItemCount())) {
			return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
		}

		if (!item.isMoveable() && !hasBitSet(CylinderFlag.FLAG_IGNORENOTMOVEABLE, flags)) {
			return ReturnValue.RETURNVALUE_NOTMOVEABLE;
		}

		return ReturnValue.RETURNVALUE_NOERROR;
	}

	public queryDestination(index: { value: number }, thing: Thing, destItem: Item, flags: { value: number }): Cylinder {
		let destTile: Tile = null;
		// *destItem = nullptr; // can it be like this?

		if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_DOWN)) {
			let dx = this.tilePos.x;
			let dy = this.tilePos.y;
			let dz = this.tilePos.z + 1;

			const southDownTile = g_map.getTile(dx, dy - 1, dz);
			if (southDownTile && southDownTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_SOUTH_ALT)) {
				dy -= 2;
				destTile = g_map.getTile(dx, dy, dz);
			} else {
				const eastDownTile = g_map.getTile(dx - 1, dy, dz);
				if (eastDownTile && eastDownTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_EAST_ALT)) {
					dx -= 2;
					destTile = g_map.getTile(dx, dy, dz);
				} else {
					const downTile = g_map.getTile(dx, dy, dz);
					if (downTile) {
						if (downTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_NORTH)) {
							++dy;
						}

						if (downTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_SOUTH)) {
							--dy;
						}

						if (downTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_SOUTH_ALT)) {
							dy -= 2;
						}

						if (downTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_EAST)) {
							--dx;
						}

						if (downTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_EAST_ALT)) {
							dx -= 2;
						}

						if (downTile.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_WEST)) {
							++dx;
						}

						destTile = g_map.getTile(dx, dy, dz);
					}
				}
			}
		} else if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE)) {
			let dx = this.tilePos.x;
			let dy = this.tilePos.y;
			let dz = this.tilePos.z - 1;

			if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_NORTH)) {
				--dy;
			}

			if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_SOUTH)) {
				++dy;
			}

			if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_EAST)) {
				++dx;
			}

			if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_WEST)) {
				--dx;
			}

			if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_SOUTH_ALT)) {
				dy += 2;
			}

			if (this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE_EAST_ALT)) {
				dx += 2;
			}

			destTile = g_map.getTile(dx, dy, dz);
		}

		if (!destTile) {
			destTile = this;
		} else {
			this.flags |= CylinderFlag.FLAG_NOLIMIT;    //Will ignore that there is blocking items/creatures
		}

		if (destTile) {
			const destThing = destTile.getTopDownItem();
			if (destThing) {
				destItem.replaceWith(destThing.getItem());
			}
		}
		return destTile;
	}

	public addThing(thing: Thing, index?: number): void {
		const creature = thing.getCreature();
		if (creature) {
			g_map.clearSpectatorCache();
			creature.setParent(this);
			const creatures = this.getCreatures();
			creatures.unshift(creature);
		} else {
			const item = thing.getItem();
			if (!item) {
				return /*RETURNVALUE_NOTPOSSIBLE*/;
			}

			let items = this.getItemList();
			if (items && items.length >= 0xFFFF) {
				return /*RETURNVALUE_NOTPOSSIBLE*/;
			}

			item.setParent(this);

			const itemType = item.itemType;
			if (itemType.isGroundTile()) {
				if (!this.ground) {
					this.ground = item;
					this.onAddTileItem(item);
				} else {
					const oldType = this.ground.itemType

					const oldGround = this.ground;
					this.ground.setParent(null);
					g_game.releaseItem(this.ground);
					this.ground = item;
					this.resetTileFlags(oldGround);
					this.setTileFlags(item);
					this.onUpdateTileItem(oldGround, oldType, item, itemType);
					this.postRemoveNotification(oldGround, null, 0);
				}
			} else if (itemType.isAlwaysOnTop) {
				if (itemType.isSplash() && items) {
					//remove old splash if exists
					// for (ItemVector::const_iterator it = items.getBeginTopItem(), end = items.getEndTopItem(); it != end; ++it) {
					for (let item of items) {
						const oldSplash: Item = item;
						if (!oldSplash.itemType.isSplash()) {
							continue;
						}

						this.removeThing(oldSplash, 1);
						oldSplash.setParent(null);
						g_game.releaseItem(oldSplash);
						this.postRemoveNotification(oldSplash, null, 0);
						break;
					}
				}

				let isInserted = false;

				if (items) {
					// for (let it of items) {
					for (let i = 0; i < items.length; i++) {
						const it = items[i];
						//Note: this is different from internalAddThing
						if (itemType.topOrder <= it.itemType.topOrder) {
							items.splice(i, 0, item);
							isInserted = true;
							break;
						}
					}
				} else {
					items = this.getItemList();
				}

				if (!isInserted) {
					items.push(item);
				}

				this.onAddTileItem(item);
			} else {
				if (itemType.isMagicField) {
					//remove old field item if exists
					if (items) {
						// for (ItemVector::const_iterator it = items.getBeginDownItem(), end = items.getEndDownItem(); it != end; ++it) {
						for (let i = items.length - 1; i >= 0; i--) {
							const it = items[i];
							const oldField = it.getMagicField();
							if (oldField) {
								if (oldField.itemType.isReplacable) {
									this.removeThing(oldField, 1);

									oldField.setParent(null);
									g_game.releaseItem(oldField);
									this.postRemoveNotification(oldField, null, 0);
									break;
								} else {
									//This magic field cannot be replaced.
									item.setParent(null);
									g_game.releaseItem(item);
									return;
								}
							}
						}
					}
				}

				items = this.getItemList();
				items.unshift(item);
				items.addDownItemCount(1);
				this.onAddTileItem(item);
			}
		}
	}

	public updateThing(thing: Thing, itemId: number, count: number): void {
		const index = this.getThingIndex(thing);
		if (index === -1) {
			return /*RETURNVALUE_NOTPOSSIBLE*/;
		}

		const item = thing.getItem();
		if (!item) {
			return /*RETURNVALUE_NOTPOSSIBLE*/;
		}

		const oldType = item.itemType;
		const newType = Items.getItemType(itemId);//Item::items[itemId];
		const newItem = new Item(newType);
		this.resetTileFlags(item);
		newItem.setSubType(count);
		item.replaceWith(newItem);
		this.setTileFlags(item);
		this.onUpdateTileItem(item, oldType, item, newType);
	}

	public replaceThing(index: number, thing: Thing): void {
		let pos = index;

		const item = thing.getItem();
		if (!item) {
			return /*RETURNVALUE_NOTPOSSIBLE*/;
		}

		let oldItem: Item = null;
		let isInserted = false;

		if (this.ground) {
			if (pos === 0) {
				oldItem = this.ground;
				this.ground = item;
				isInserted = true;
			}

			--pos;
		}

		const items = this.getItemList();
		if (items && !isInserted) {
			const topItemSize = this.getTopItemCount();
			if (pos < topItemSize) {
				let index = 0;
				index += pos;

				oldItem = items[index];
				const removed = items.splice(index, 1, item)[0];
				isInserted = true;
			}

			pos -= topItemSize;
		}

		const creatures = this.getCreatures();
		if (creatures) {
			if (!isInserted && pos < creatures.length) {
				return /*RETURNVALUE_NOTPOSSIBLE*/;
			}

			pos -= creatures.length;
		}

		if (items && !isInserted) {
			let downItemSize = this.getDownItemCount();
			if (pos < downItemSize) {
				const index = pos;
				const item = items[pos];
				oldItem = item;
				const removed = items.splice(index, 1, item)[0];
				isInserted = true;
			}
		}

		if (isInserted) {
			item.setParent(this);

			this.resetTileFlags(oldItem);
			this.setTileFlags(item);
			const oldType = oldItem.itemType;
			const newType = item.itemType;
			this.onUpdateTileItem(oldItem, oldType, item, newType);

			oldItem.setParent(null);
			return /*RETURNVALUE_NOERROR*/;
		}
	}

	public removeThing(thing: Thing, count: number): void {
		const creature = thing.getCreature();
		if (creature) {
			const creatures = this.getCreatures();
			if (creatures) {
				// auto it = std::find(creatures.begin(), creatures.end(), thing);
				// if (it != creatures.end()) {
				// 	g_game.map.clearSpectatorCache();
				// 	creatures.erase(it);
				// }
			}
			return;
		}

		const item = thing.getItem();
		if (!item) {
			return;
		}

		const index = this.getThingIndex(item);
		if (index === -1) {
			return;
		}

		if (item === this.ground) {
			this.ground.setParent(null);
			this.ground = null;

			let list: SpectatorVector = [];
			g_map.getSpectators(list, this.getPosition(), true);
			this.onRemoveTileItem(list, [], item);
			return;
		}

		const items = this.getItemList();
		if (!items) {
			return;
		}

		const itemType = item.itemType;
		if (itemType.isAlwaysOnTop) {
			const index = items.indexOf(item);
			if (index === items.length - 1)
				return;

			const oldStackPosVector: number[] = [];

			let list: SpectatorVector = [];
			g_map.getSpectators(list, this.getPosition(), true);
			for (let spectator of list) {
				const tmpPlayer = spectator.getPlayer();
				if (tmpPlayer) {
					oldStackPosVector.push(this.getStackposOfItem(tmpPlayer, item));
				}
			}

			item.setParent(null);
			items.removeItem(item);
			this.onRemoveTileItem(list, oldStackPosVector, item);
		} else {
			const reversedItemList = items.slice().reverse();
			const found = reversedItemList.find(_item => _item === item);
			const index = reversedItemList.indexOf(found);
			if (index === items.length - 1) {
				return;
			}

			if (itemType.isStackable && count !== item.getItemCount()) {
				const c = item.getItemCount() - count;
				const newCount = Math.max(0, c > 0xFF ? -1 : c);
				item.count = newCount;
				this.onUpdateTileItem(item, itemType, item, itemType);
			} else {
				const oldStackPosVector: number[] = [];

				let list: SpectatorVector = [];
				g_map.getSpectators(list, this.getPosition(), true);
				for (let spectator of list) {
					const tmpPlayer = spectator.getPlayer();
					if (tmpPlayer) {
						oldStackPosVector.push(this.getStackposOfItem(tmpPlayer, item));
					}
				}

				item.setParent(null);
				items.unshift(item);
				items.addDownItemCount(-1);
				this.onRemoveTileItem(list, oldStackPosVector, item);
			}
		}
	}

	public removeCreature(creature: Creature): void {
		g_map.getQTNode(this.tilePos.x, this.tilePos.y).removeCreature(creature);
		this.removeThing(creature, 0);
	}

	public getThingIndex(thing: Thing): number {
		let n = -1;
		if (this.ground) {
			if (this.ground === thing) {
				return 0;
			}
			++n;
		}

		const items = this.getItemList();
		if (items) {
			const item = thing.getItem();
			if (item && item.itemType.isAlwaysOnTop) {
				for (let it of items) {
					++n;
					if (it === item)
						return n;
				}
			} else {
				n += items.getTopItemCount();
			}
		}

		const creatures = this.getCreatures();
		if (creatures) {
			if (thing.getCreature()) {
				for (let creature of creatures) {
					++n;
					if (creature === thing) {
						return n;
					}
				}
			} else {
				n += creatures.length;
			}
		}

		if (items) {
			const item = thing.getItem();
			if (item && !item.itemType.isAlwaysOnTop) {
				for (let i = items.length - 1; i >= 0; i--) {
					++n;
					const it = items[i];
					if (it === item)
						return n;
				}
			}
		}
		return -1;
	}

	public getFirstIndex(): number {
		return 0;
	}

	public getLastIndex(): number {
		return this.getThingCount();
	}

	public getItemTypeCount(itemId: number, subType: number = -1): number {
		let count = 0;
		if (this.ground && this.ground.getID() === itemId) {
			count += Item.countByType(this.ground, subType);
		}

		const items = this.getItemList();
		if (items) {
			for (let item of items) {
				if (item.getID() === itemId) {
					count += Item.countByType(item, subType);
				}
			}
		}
		return count;
	}

	public getThing(index: number): Thing {
		if (this.ground) {
			if (index === 0) {
				return this.ground;
			}

			--index;
		}

		const items = this.getItemList();
		if (items) {
			const topItemSize = items.getTopItemCount();
			if (index < topItemSize) {
				return items[items.getDownItemCount() + index];
			}
			index -= topItemSize;
		}

		const creatures = this.getCreatures();
		if (creatures) {
			if (index < creatures.length) {
				return creatures[index];
			}
			index -= creatures.length;
		}

		if (items && index < items.getDownItemCount()) {
			return items[index];
		}

		return null;
	}

	public postAddNotification(thing: Thing, oldParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {
		let list: SpectatorVector = [];
		g_map.getSpectators(list, this.getPosition(), true, true);
		for (let spectator of list) {
			spectator.getPlayer().postAddNotification(thing, oldParent, index, CylinderLink.LINK_NEAR);
		}

		//add a reference to this item, it may be deleted after being added (mailbox for example)
		const creature = thing.getCreature();
		let item: Item;
		if (creature) {
			// creature.incrementReferenceCounter();
			item = null;
		} else {
			item = thing.getItem();
			if (item) {
				// item.incrementReferenceCounter();
			}
		}

		if (link === CylinderLink.LINK_OWNER) {
			if (this.hasFlag(TileFlag.TILESTATE_TELEPORT)) {
				const teleport = this.getTeleportItem();
				if (teleport) {
					teleport.addThing(thing);
				}
			} else if (this.hasFlag(TileFlag.TILESTATE_TRASHHOLDER)) {
				const trashholder = this.getTrashHolder();
				if (trashholder) {
					trashholder.addThing(thing);
				}
			} else if (this.hasFlag(TileFlag.TILESTATE_MAILBOX)) {
				const mailbox = this.getMailbox();
				if (mailbox) {
					mailbox.addThing(thing);
				}
			}

			//calling movement scripts
			if (creature) {
				// g_moveEvents.onCreatureMove(creature, this, MOVE_EVENT_STEP_IN); // TO DO
			} else if (item) {
				// g_moveEvents.onItemMove(item, this, true); // TO DO
			}
		}

		//release the reference to this item onces we are finished
		if (creature) {
			g_game.releaseCreature(creature);
		} else if (item) {
			g_game.releaseItem(item);
		}
	}

	public postRemoveNotification(thing: Thing, newParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {
		let list: SpectatorVector = [];
		g_map.getSpectators(list, this.getPosition(), true, true);

		if (this.getThingCount() > 8) {
			this.onUpdateTile(list);
		}

		for (let spectator of list) {
			spectator.getPlayer().postRemoveNotification(thing, newParent, index, CylinderLink.LINK_NEAR);
		}

		//calling movement scripts
		const creature = thing.getCreature();
		if (creature) {
			// g_moveEvents.onCreatureMove(creature, this, MOVE_EVENT_STEP_OUT);
		} else {
			const item = thing.getItem();
			if (item) {
				// g_moveEvents.onItemMove(item, this, false);
			}
		}
	}

	public internalAddThing(thing: Thing, index?: number): void {
		thing.setParent(this);

		const creature = thing.getCreature();
		if (creature) {
			g_map.clearSpectatorCache();
			const creatures = this.getCreatures();
			creatures.unshift(creature);
		} else {
			const item = thing.getItem();
			if (!item) {
				return;
			}

			const itemType = item.itemType;
			if (itemType.isGroundTile()) {
				if (!this.ground) {
					this.ground = item;
					this.setTileFlags(item);
				}
				return;
			}

			const items = this.getItemList();
			if (items.length >= 0xFFFF) {
				return /*RETURNVALUE_NOTPOSSIBLE*/;
			}

			if (itemType.isAlwaysOnTop) {
				let isInserted = false;
				for (let i = 0; i < items.length; i++) {
					const it = items[i];
					if (it.itemType.isAlwaysOnTop > itemType.isAlwaysOnTop) {
						items.splice(i, 0, item);
						isInserted = true;
						break;
					}
				}

				if (!isInserted) {
					items.push(item);
				}
			} else {
				items.push(item);// items.insert(items.getBeginDownItem(), item);
				items.addDownItemCount(1);
			}

			this.setTileFlags(item);
		}
	}

	public getPosition(): Position {
		return this.tilePos;
	}

	public setPosition(position: Position): void {
		this.tilePos = position;
	}

	public isRemoved(): boolean {
		return false;
	}

	public getUseItem(): Item {
		return null;
	}

	public getGround(): Item {
		return this.ground;
	}

	public setGround(item: Item): void {
		this.ground = item;
	}

	// private:
	private onAddTileItem(item: Item): void {
		if (item.hasProperty(ItemProperty.CONST_PROP_MOVEABLE) || item.getContainer()) {
			// auto it = g_game.browseFields.find(this);
			// if (it != g_game.browseFields.end()) {
			// 	it.second.addItemBack(item);
			// 	item.setParent(this);
			// }
		}

		this.setTileFlags(item);

		const cylinderMapPos = this.getPosition();

		const list: SpectatorVector = [];
		g_map.getSpectators(list, cylinderMapPos, true);

		//send to client
		for (let spectator of list) {
			const tmpPlayer = spectator.getPlayer();
			if (tmpPlayer) {
				tmpPlayer.sendAddTileItem(this, cylinderMapPos, item);
			}
		}

		//event methods
		for (let spectator of list) {
			spectator.onAddTileItem(this, cylinderMapPos);
		}
	}

	private onUpdateTileItem(oldItem: Item, oldType: ItemType, newItem: Item, newType: ItemType): void {
		if (newItem.hasProperty(ItemProperty.CONST_PROP_MOVEABLE) || newItem.getContainer()) {
			// auto it = g_game.browseFields.find(this);
			// if (it != g_game.browseFields.end()) {
			// 	int32_t index = it.second.getThingIndex(oldItem);
			// 	if (index != -1) {
			// 		it.second.replaceThing(index, newItem);
			// 		newItem.setParent(this);
			// 	}
			// }
		} else if (oldItem.hasProperty(ItemProperty.CONST_PROP_MOVEABLE) || oldItem.getContainer()) {
			// auto it = g_game.browseFields.find(this);
			// if (it != g_game.browseFields.end()) {
			// 	Cylinder * oldParent = oldItem.getParent();
			// 	it.second.removeThing(oldItem, oldItem.getItemCount());
			// 	oldItem.setParent(oldParent);
			// }
		}

		const cylinderMapPos = this.getPosition();

		const list: SpectatorVector = [];
		g_map.getSpectators(list, cylinderMapPos, true);

		//send to client
		for (let spectator of list) {
			const tmpPlayer = spectator.getPlayer();
			if (tmpPlayer) {
				tmpPlayer.sendUpdateTileItem(this, cylinderMapPos, newItem);
			}
		}

		//event methods
		for (let creature of list) {
			creature.onUpdateTileItem(this, cylinderMapPos, oldItem, oldType, newItem, newType);
		}
	}

	private onRemoveTileItem(list: SpectatorVector, oldStackPosVector: Array<number>, item: Item): void {
		if (item.hasProperty(ItemProperty.CONST_PROP_MOVEABLE) || item.getContainer()) {
			// auto it = g_game.browseFields.find(this);
			// if (it != g_game.browseFields.end()) {
			// 	it.second.removeThing(item, item.getItemCount());
			// }
		}

		this.resetTileFlags(item);

		const cylinderMapPos = this.getPosition();
		const iType = item.itemType;

		//send to client
		let i = 0;
		for (let spectator of list) {
			const tmpPlayer = spectator.getPlayer();
			if (tmpPlayer) {
				tmpPlayer.sendRemoveTileThing(cylinderMapPos, oldStackPosVector[i++]);
			}
		}

		//event methods
		for (let spectator of list) {
			spectator.onRemoveTileItem(this, cylinderMapPos, iType, item);
		}
	}

	private onUpdateTile(list: SpectatorVector): void {
		const cylinderMapPos = this.getPosition();

		//send to clients
		for (let spectator of list) {
			spectator.getPlayer().sendUpdateTile(this, cylinderMapPos);
		}
	}

	private setTileFlags(item: Item): void {
		if (!this.hasFlag(TileFlag.TILESTATE_FLOORCHANGE)) {
			const it = item.itemType;
			if (it.floorChange != 0) {
				this.setFlag(it.floorChange);
			}
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_IMMOVABLEBLOCKSOLID)) {
			this.setFlag(TileFlag.TILESTATE_IMMOVABLEBLOCKSOLID);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_BLOCKPATH)) {
			this.setFlag(TileFlag.TILESTATE_BLOCKPATH);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_NOFIELDBLOCKPATH)) {
			this.setFlag(TileFlag.TILESTATE_NOFIELDBLOCKPATH);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_IMMOVABLENOFIELDBLOCKPATH)) {
			this.setFlag(TileFlag.TILESTATE_IMMOVABLENOFIELDBLOCKPATH);
		}

		if (item.getTeleport()) {
			this.setFlag(TileFlag.TILESTATE_TELEPORT);
		}

		if (item.getMagicField()) {
			this.setFlag(TileFlag.TILESTATE_MAGICFIELD);
		}

		if (item.getMailbox()) {
			this.setFlag(TileFlag.TILESTATE_MAILBOX);
		}

		if (item.getTrashHolder()) {
			this.setFlag(TileFlag.TILESTATE_TRASHHOLDER);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_BLOCKSOLID)) {
			this.setFlag(TileFlag.TILESTATE_BLOCKSOLID);
		}

		if (item.getBed()) {
			this.setFlag(TileFlag.TILESTATE_BED);
		}

		const container = item.getContainer();
		if (container && container.getDepotLocker()) {
			this.setFlag(TileFlag.TILESTATE_DEPOT);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_SUPPORTHANGABLE)) {
			this.setFlag(TileFlag.TILESTATE_SUPPORTS_HANGABLE);
		}
	}

	private resetTileFlags(item: Item): void {
		const it = item.itemType;
		if (it.floorChange !== 0) {
			this.resetFlag(TileFlag.TILESTATE_FLOORCHANGE);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_BLOCKSOLID) && !this.hasProperty(ItemProperty.CONST_PROP_BLOCKSOLID, item)) {
			this.resetFlag(TileFlag.TILESTATE_BLOCKSOLID);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_IMMOVABLEBLOCKSOLID) && !this.hasProperty(ItemProperty.CONST_PROP_IMMOVABLEBLOCKSOLID, item)) {
			this.resetFlag(TileFlag.TILESTATE_IMMOVABLEBLOCKSOLID);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_BLOCKPATH) && !this.hasProperty(ItemProperty.CONST_PROP_BLOCKPATH, item)) {
			this.resetFlag(TileFlag.TILESTATE_BLOCKPATH);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_NOFIELDBLOCKPATH) && !this.hasProperty(ItemProperty.CONST_PROP_NOFIELDBLOCKPATH, item)) {
			this.resetFlag(TileFlag.TILESTATE_NOFIELDBLOCKPATH);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_IMMOVABLEBLOCKPATH) && !this.hasProperty(ItemProperty.CONST_PROP_IMMOVABLEBLOCKPATH, item)) {
			this.resetFlag(TileFlag.TILESTATE_IMMOVABLEBLOCKPATH);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_IMMOVABLENOFIELDBLOCKPATH) && !this.hasProperty(ItemProperty.CONST_PROP_IMMOVABLENOFIELDBLOCKPATH, item)) {
			this.resetFlag(TileFlag.TILESTATE_IMMOVABLENOFIELDBLOCKPATH);
		}

		if (item.getTeleport()) {
			this.resetFlag(TileFlag.TILESTATE_TELEPORT);
		}

		if (item.getMagicField()) {
			this.resetFlag(TileFlag.TILESTATE_MAGICFIELD);
		}

		if (item.getMailbox()) {
			this.resetFlag(TileFlag.TILESTATE_MAILBOX);
		}

		if (item.getTrashHolder()) {
			this.resetFlag(TileFlag.TILESTATE_TRASHHOLDER);
		}

		if (item.getBed()) {
			this.resetFlag(TileFlag.TILESTATE_BED);
		}

		const container = item.getContainer();
		if (container && container.getDepotLocker()) {
			this.resetFlag(TileFlag.TILESTATE_DEPOT);
		}

		if (item.hasProperty(ItemProperty.CONST_PROP_SUPPORTHANGABLE)) {
			this.resetFlag(TileFlag.TILESTATE_SUPPORTS_HANGABLE);
		}
	}

}
