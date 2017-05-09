// import * as Enums from './enums';
import {
	ItemTypes, ItemGroup, TileFlag, CorpseType, FluidType, WeaponType, SlotPositionBits, CombatType,
	FloorChangeDirection, Effect, AmmoType, SlotType, ProjectileType, AmmoTypeNames, ShootType, ShootTypeNames,
	MagicEffectClasses, MagicEffectNames, Skills, Stats, ConditionType, ConditionParam, Direction,
	ItemProperty, ItemAttribute, ItemAttributeType, ConditionId, AttrReadValue, AttrTypes, ItemDecayState,
	PlayerSex
} from './Enums';
import { Thing } from './Thing';
import { MagicField } from './MagicField';
import * as deepExtend from 'deep-extend';
import { clearObject } from './utils';
import { TrashHolder } from './TrashHolder';
import { Teleport } from './Teleport';
import { Mailbox } from './Mailbox';
import { BedItem } from './Bed';
import { LightInfo } from './LightInfo';
import { FileLoader, Node, PropertyReader } from './fileLoader';
import { g_game } from './otserv';

import { list } from 'tstl';

const parseBool = (val: any): boolean => {
	if (typeof val === "boolean")
		return val
	if (typeof val === "string")
		return val === "true" ? true : false;
	if (typeof val === "number")
		return val ? true : false;
	return false;
};

const getAmmoType = (ammoTypeStr: string): AmmoType => {
	return AmmoTypeNames[ammoTypeStr.toLocaleLowerCase()] || AmmoType.None;
};

const getShootType = (shotTypeStr: string): ShootType => {
	return ShootTypeNames[shotTypeStr.toLocaleLowerCase()] || AmmoType.None;
};

const getMagicEffect = (magicEffectStr: string): MagicEffectClasses => {
	return MagicEffectNames[magicEffectStr.toLocaleLowerCase()] || MagicEffectClasses.CONST_ME_NONE;
};

const getDirection = (string: string): Direction => {
	let direction = Direction.NORTH;

	if (string === "north" || string === "n" || string === "0") {
		direction = Direction.NORTH;
	} else if (string === "east" || string === "e" || string === "1") {
		direction = Direction.East;
	} else if (string === "south" || string === "s" || string === "2") {
		direction = Direction.South;
	} else if (string === "west" || string === "w" || string === "3") {
		direction = Direction.West;
	} else if (string === "southwest" || string === "south west" || string === "south-west" || string === "sw" || string === "4") {
		direction = Direction.SouthWest;
	} else if (string === "southeast" || string === "south east" || string === "south-east" || string === "se" || string === "5") {
		direction = Direction.SouthEast;
	} else if (string === "northwest" || string === "north west" || string === "north-west" || string === "nw" || string === "6") {
		direction = Direction.NORTHWEST;
	} else if (string === "northeast" || string === "north east" || string === "north-east" || string === "ne" || string === "7") {
		direction = Direction.NorthEast;
	}

	return direction;
};

const combatTypeToIndex = (combatType: number): number => {
	switch (combatType) {
		case CombatType.COMBAT_PHYSICALDAMAGE:
			return 0;
		case CombatType.COMBAT_ENERGYDAMAGE:
			return 1;
		case CombatType.COMBAT_EARTHDAMAGE:
			return 2;
		case CombatType.COMBAT_FIREDAMAGE:
			return 3;
		case CombatType.COMBAT_UNDEFINEDDAMAGE:
			return 4;
		case CombatType.COMBAT_LIFEDRAIN:
			return 5;
		case CombatType.COMBAT_MANADRAIN:
			return 6;
		case CombatType.COMBAT_HEALING:
			return 7;
		case CombatType.COMBAT_DROWNDAMAGE:
			return 8;
		case CombatType.COMBAT_ICEDAMAGE:
			return 9;
		case CombatType.COMBAT_HOLYDAMAGE:
			return 10;
		case CombatType.COMBAT_DEATHDAMAGE:
			return 11;
		default:
			return 0;
	}
};

export class Abilities {
	public healthGain: number = 0;
	public healthTicks: number = 0;
	public manaGain: number = 0;
	public manaTicks: number = 0;

	public conditionImmunities = 0;
	public conditionSuppressions = 0;

	//stats modifiers
	public stats = [];
	public statsPercent = [];

	//extra skill modifiers
	public skills = [];

	public speed: number = 0;

	// field damage abilities modifiers
	public fieldAbsorbPercent = [];

	//damage abilities modifiers
	public absorbPercent = [];

	//elemental damage
	public elementDamage: number = 0;
	public elementType: CombatType = CombatType.COMBAT_NONE;

	public manaShield: boolean = false;
	public invisible: boolean = false;
	public regeneration: boolean = false;
}

export class ConditionDamage {
	constructor(conditionID: ConditionId, conditionType: ConditionType) {
		// TO DO
	}

	reset(newCondition: ConditionDamage): void { }
	addDamage(rounds: number, time: number, value: number): boolean { return true; }
	setParam(param: ConditionParam, value: number): boolean { return true; }
	getTotalDamage(): number { return 0; }
}

class Attribute {
	public type: ItemAttributeType; // ???
}

class ItemAttributes {
	// std::forward_list<Attribute> attributes;
	public list: list<Attribute> = new list<Attribute>();
	public attributeBits: number = 0;

	public setUniqueId(n: number) :void {
		
	}

	public setStrAttr(type: ItemAttributeType, value: string): void {

	}

	public setIntAttr(type: ItemAttributeType, value: number) {

	}
}


export class ItemType {

	public serverID: number = 0;
	public clientID: number = 100;
	public weight: number = 0;
	public name: string = '';
	public description: string;
	public article: string;
	public pluralName: string;
	// public specialDescription: string;
	public runeSpellName: string;
	public armor: number = 0;
	// public volume: number = 0;
	public defense: number = 0;
	public attack: number = 0;
	// public extraAttack: number = 0;
	public extraDefense: number = 0;
	public rotateTo: number = 0;
	public showCount: boolean = false;
	// public floorChangeDirection: FloorChangeDirection = FloorChangeDirection.None;
	// public fluid: FluidType = FluidType.Empty;
	// public maxTextLength: number = 0;
	public writeOnceItemId: number = 0;
	public weaponType: WeaponType = WeaponType.None;
	public ammoType: AmmoType = AmmoType.None;
	public group: number = 0;
	public decayTo: number = 0;
	public transformEquipTo: number = 0;
	// public transformDequipTo: number = 0;
	// public duration: number = 0;
	public showDuration: boolean = false;
	public charges: number = 0;
	public showCharges: boolean = false;
	// public breakChance: number = 0;
	public speed: number = 0;
	public isAlwaysOnTop: boolean = false;
	public alwaysOnTopOrder: number = 0;
	public isBlocking: boolean = false;
	public isProjectileBlocking: boolean = false;
	public isPathBlocking: boolean = false;
	public hasHeight: boolean = false;
	public isUseable: boolean = false;
	public isPickupable: boolean = false;
	public isMoveable: boolean = false;
	public isStackable: boolean = false;
	public isVertical: boolean = false;
	public isHorizontal: boolean = false;
	public isHangable: boolean = false;
	public isDistanceReadable: boolean = false;
	public isRotatable: boolean = false;
	public isReadable: boolean = false;
	// public isWriteable: boolean = false;
	public hasClientCharges: boolean = false;
	public canLookThrough: boolean = false;
	// public hasExtraByte: boolean = false;
	public isAnimated: boolean = false;

	public isReplacable: boolean = false;
	public isMagicField: boolean = false;

	public floorChange: number = 0;


	private abilities: Abilities = new Abilities();
	public lightInfo: LightInfo = new LightInfo();
	public wareID: number = -1;
	public type: ItemTypes = -1;
	public corpseType: CorpseType = CorpseType.None;
	public moveable: boolean = false;
	public blockProjectile: boolean = false;
	public allowPickupable: boolean = false;
	public fluidSource: FluidType = FluidType.FLUID_NONE;
	public maxItems: number = 0;
	public canReadText: boolean = false;
	public canWriteText: boolean = false;
	public maxTextLen: number = 0;
	public slotPosition: SlotPositionBits = SlotPositionBits.SLOTP_WHEREEVER;
	public shootType: ShootType = ShootType.CONST_ANI_NONE;
	public magicEffect: MagicEffectClasses = MagicEffectClasses.CONST_ME_NONE;
	public shootRange: number = 0;
	public stopTime: boolean = false;
	public transformDeEquipTo: number = 0;
	public decayTime: number = 0;
	public showAttributes: boolean = false;
	public hitChance: number = 0;
	public maxHitChance: number = 0;
	public combatType: CombatType = null;
	public replaceable: boolean = false;
	public bedPartnerDir: Direction = Direction.North;
	public levelDoor: number = 0;
	public transformToFree: number = 0;
	public destroyTo: number = 0;
	public walkStack: boolean = false;
	public blockSolid: boolean = false;
	public allowDistRead: boolean = false;
	public conditionDamage: ConditionDamage = new ConditionDamage(ConditionId.CONDITIONID_DEFAULT, ConditionType.CONDITION_NONE)
	public transformToOnUse: PlayerSex[] = [0, 0];

	public extend(xmlItem: XMLItem): void {
		const obj = xmlItem.getObject();

		const { id, fromid, toid } = obj;

		if (id) {
			this.parseItemNode(obj, id);
			return;
		}

		if (!fromid)
			return console.log("[Warning - Items::loadFromXml] No item fromid found.");

		if (!toid)
			return console.log(`[Warning - Items::loadFromXml] fromid (${id}) without toid`);
	}

	private getAbilities(): Abilities {
		return this.abilities;
	}

	private parseItemNode(obj: any, id: number) {
		if (id > 30000 && id < 30100) {
			id -= 30000;

			this.serverID = id;
		}

		const { name, article, plural } = obj;
		let { attribute } = obj;

		this.name = name;

		if (article)
			this.article = article;

		if (plural)
			this.pluralName = plural;

		if (attribute) {
			if (!Array.isArray(attribute))
				attribute = [attribute];
			for (let attributeNode of attribute) {
				const { key, value } = attributeNode;
				if (!key) {
					continue;
				}

				if (!value) {
					continue;
				}

				let tmpStrValue = key.toLowerCase();
				if (tmpStrValue === "type") {
					tmpStrValue = value.toLowerCase();
					if (tmpStrValue === "key") {
						this.type = ItemTypes.ITEM_TYPE_KEY;
					} else if (tmpStrValue === "magicfield") {
						this.type = ItemTypes.ITEM_TYPE_MAGICFIELD;
					} else if (tmpStrValue === "container") {
						this.group = ItemGroup.ITEM_GROUP_CONTAINER;
						this.type = ItemTypes.ITEM_TYPE_CONTAINER;
					} else if (tmpStrValue === "depot") {
						this.type = ItemTypes.ITEM_TYPE_DEPOT;
					} else if (tmpStrValue === "mailbox") {
						this.type = ItemTypes.ITEM_TYPE_MAILBOX;
					} else if (tmpStrValue === "trashholder") {
						this.type = ItemTypes.ITEM_TYPE_TRASHHOLDER;
					} else if (tmpStrValue === "teleport") {
						this.type = ItemTypes.ITEM_TYPE_TELEPORT;
					} else if (tmpStrValue === "door") {
						this.type = ItemTypes.ITEM_TYPE_DOOR;
					} else if (tmpStrValue === "bed") {
						this.type = ItemTypes.ITEM_TYPE_BED;
					} else if (tmpStrValue === "rune") {
						this.type = ItemTypes.ITEM_TYPE_RUNE;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown type: ${value}.`);
					}
				} else if (tmpStrValue === "description") {
					this.description = String(value);
				} else if (tmpStrValue === "runespellname") {
					this.runeSpellName = String(value);
				} else if (tmpStrValue === "weight") {
					this.weight = parseInt(value);
				} else if (tmpStrValue === "showcount") {
					this.showCount = parseBool(value);
				} else if (tmpStrValue === "armor") {
					this.armor = parseInt(value);
				} else if (tmpStrValue === "defense") {
					this.defense = parseInt(value);
				} else if (tmpStrValue === "extradef") {
					this.extraDefense = parseInt(value);
				} else if (tmpStrValue === "attack") {
					this.attack = parseInt(value);
				} else if (tmpStrValue === "rotateto") {
					this.rotateTo = parseInt(value);
				} else if (tmpStrValue === "moveable" || tmpStrValue === "movable") {
					this.moveable = parseBool(value);
				} else if (tmpStrValue === "blockprojectile") {
					this.blockProjectile = parseBool(value);
				} else if (tmpStrValue === "allowpickupable" || tmpStrValue === "pickupable") {
					this.allowPickupable = parseBool(value);
				} else if (tmpStrValue === "floorchange") {
					tmpStrValue = String(value).toLocaleLowerCase();
					if (tmpStrValue === "down") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_DOWN;
					} else if (tmpStrValue === "north") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_NORTH;
					} else if (tmpStrValue === "south") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_SOUTH;
					} else if (tmpStrValue === "southalt") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_SOUTH_ALT;
					} else if (tmpStrValue === "west") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_WEST;
					} else if (tmpStrValue === "east") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_EAST;
					} else if (tmpStrValue === "eastalt") {
						this.floorChange = TileFlag.TILESTATE_FLOORCHANGE_EAST_ALT;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown floorChange: ${value}`);
					}
				} else if (tmpStrValue === "corpsetype") {
					tmpStrValue = String(value).toLocaleLowerCase();
					if (tmpStrValue === "venom") {
						this.corpseType = CorpseType.Venom;
					} else if (tmpStrValue === "blood") {
						this.corpseType = CorpseType.Blood;
					} else if (tmpStrValue === "undead") {
						this.corpseType = CorpseType.Undead;
					} else if (tmpStrValue === "fire") {
						this.corpseType = CorpseType.Fire;
					} else if (tmpStrValue === "energy") {
						this.corpseType = CorpseType.Energy;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown corpseType: ${value}.`);
					}
				} else if (tmpStrValue === "containersize") {
					this.maxItems = parseInt(value);
				} else if (tmpStrValue === "fluidsource") {
					tmpStrValue = String(value).toLocaleLowerCase();
					if (tmpStrValue === "water") {
						this.fluidSource = FluidType.FLUID_WATER;
					} else if (tmpStrValue === "blood") {
						this.fluidSource = FluidType.FLUID_BLOOD;
					} else if (tmpStrValue === "beer") {
						this.fluidSource = FluidType.FLUID_BEER;
					} else if (tmpStrValue === "slime") {
						this.fluidSource = FluidType.FLUID_SLIME;
					} else if (tmpStrValue === "lemonade") {
						this.fluidSource = FluidType.FLUID_LEMONADE;
					} else if (tmpStrValue === "milk") {
						this.fluidSource = FluidType.FLUID_MILK;
					} else if (tmpStrValue === "mana") {
						this.fluidSource = FluidType.FLUID_MANA;
					} else if (tmpStrValue === "life") {
						this.fluidSource = FluidType.FLUID_LIFE;
					} else if (tmpStrValue === "oil") {
						this.fluidSource = FluidType.FLUID_OIL;
					} else if (tmpStrValue === "urine") {
						this.fluidSource = FluidType.FLUID_URINE;
					} else if (tmpStrValue === "coconut") {
						this.fluidSource = FluidType.FLUID_COCONUTMILK;
					} else if (tmpStrValue === "wine") {
						this.fluidSource = FluidType.FLUID_WINE;
					} else if (tmpStrValue === "mud") {
						this.fluidSource = FluidType.FLUID_MUD;
					} else if (tmpStrValue === "fruitjuice") {
						this.fluidSource = FluidType.FLUID_FRUITJUICE;
					} else if (tmpStrValue === "lava") {
						this.fluidSource = FluidType.FLUID_LAVA;
					} else if (tmpStrValue === "rum") {
						this.fluidSource = FluidType.FLUID_RUM;
					} else if (tmpStrValue === "swamp") {
						this.fluidSource = FluidType.FLUID_SWAMP;
					} else if (tmpStrValue === "tea") {
						this.fluidSource = FluidType.FLUID_TEA;
					} else if (tmpStrValue === "mead") {
						this.fluidSource = FluidType.FLUID_MEAD;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown fluidSource: ${value}.`);
					}
				} else if (tmpStrValue === "readable") {
					this.canReadText = parseBool(value);
				} else if (tmpStrValue === "writeable") {
					this.canWriteText = parseBool(value);
					this.canReadText = this.canWriteText;
				} else if (tmpStrValue === "maxtextlen") {
					this.maxTextLen = parseInt(value);
				} else if (tmpStrValue === "writeonceitemid") {
					this.writeOnceItemId = parseInt(value);
				} else if (tmpStrValue === "weapontype") {
					tmpStrValue = String(value).toLocaleLowerCase();
					if (tmpStrValue === "sword") {
						this.weaponType = WeaponType.Sword;
					} else if (tmpStrValue === "club") {
						this.weaponType = WeaponType.Club;
					} else if (tmpStrValue === "axe") {
						this.weaponType = WeaponType.Ammunition;
					} else if (tmpStrValue === "shield") {
						this.weaponType = WeaponType.Shield;
					} else if (tmpStrValue === "distance") {
						this.weaponType = WeaponType.Distance;
					} else if (tmpStrValue === "wand") {
						this.weaponType = WeaponType.Wand;
					} else if (tmpStrValue === "ammunition") {
						this.weaponType = WeaponType.Ammunition;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown weaponType: ${value}.`);
					}
				} else if (tmpStrValue === "slottype") {
					tmpStrValue = String(value).toLocaleLowerCase();
					if (tmpStrValue === "head") {
						this.slotPosition |= SlotPositionBits.SLOTP_HEAD;
					} else if (tmpStrValue === "body") {
						this.slotPosition |= SlotPositionBits.SLOTP_ARMOR;
					} else if (tmpStrValue === "legs") {
						this.slotPosition |= SlotPositionBits.SLOTP_LEGS;
					} else if (tmpStrValue === "feet") {
						this.slotPosition |= SlotPositionBits.SLOTP_FEET;
					} else if (tmpStrValue === "backpack") {
						this.slotPosition |= SlotPositionBits.SLOTP_BACKPACK;
					} else if (tmpStrValue === "two-handed") {
						this.slotPosition |= SlotPositionBits.SLOTP_TWO_HAND;
					} else if (tmpStrValue === "right-hand") {
						this.slotPosition &= ~SlotPositionBits.SLOTP_LEFT;
					} else if (tmpStrValue === "left-hand") {
						this.slotPosition &= ~SlotPositionBits.SLOTP_RIGHT;
					} else if (tmpStrValue === "necklace") {
						this.slotPosition |= SlotPositionBits.SLOTP_NECKLACE;
					} else if (tmpStrValue === "ring") {
						this.slotPosition |= SlotPositionBits.SLOTP_RING;
					} else if (tmpStrValue === "ammo") {
						this.slotPosition |= SlotPositionBits.SLOTP_AMMO;
					} else if (tmpStrValue === "hand") {
						this.slotPosition |= SlotPositionBits.SLOTP_HAND;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown slotType: ${value}.`);
					}
				} else if (tmpStrValue === "ammotype") {
					this.ammoType = getAmmoType(String(value).toLowerCase());
					if (this.ammoType === AmmoType.None) {
						console.log(`[Warning - Items::parseItemNode] Unknown ammoType: ${value}.`);
					}
				} else if (tmpStrValue === "shoottype") {
					const shoot = getShootType(String(value).toLowerCase());
					if (shoot !== ShootType.CONST_ANI_NONE) {
						this.shootType = shoot;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown shootType: ${value}.`);
					}
				} else if (tmpStrValue === "effect") {
					const effect = getMagicEffect(String(value).toLowerCase());
					if (effect !== MagicEffectClasses.CONST_ME_NONE) {
						this.magicEffect = effect;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown shootType: ${value}.`);
					}
				} else if (tmpStrValue === "range") {
					this.shootRange = parseInt(value);
				} else if (tmpStrValue === "stopduration") {
					this.stopTime = parseBool(value);
				} else if (tmpStrValue === "decayto") {
					this.decayTo = parseInt(value);
				} else if (tmpStrValue === "transformequipto") {
					this.transformEquipTo = parseInt(value);
				} else if (tmpStrValue === "transformdeequipto") {
					this.transformDeEquipTo = parseInt(value);
				} else if (tmpStrValue === "duration") {
					this.decayTime = parseInt(value);
				} else if (tmpStrValue === "showduration") {
					this.showDuration = parseBool(value);
				} else if (tmpStrValue === "charges") {
					this.charges = parseInt(value);
				} else if (tmpStrValue === "showcharges") {
					this.showCharges = parseBool(value);
				} else if (tmpStrValue === "showattributes") {
					this.showAttributes = parseBool(value);
				} else if (tmpStrValue === "hitchance") {
					this.hitChance = Math.min(100, Math.max(-100, parseInt(value)));
				} else if (tmpStrValue === "maxhitchance") {
					this.maxHitChance = Math.min(100, parseInt(value));
				} else if (tmpStrValue === "invisible") {
					this.getAbilities().invisible = parseBool(value);
				} else if (tmpStrValue === "speed") {
					this.getAbilities().speed = parseInt(value);
				} else if (tmpStrValue === "healthgain") {
					const abilities = this.getAbilities();
					abilities.regeneration = true;
					abilities.healthGain = parseInt(value);
				} else if (tmpStrValue === "healthticks") {
					const abilities = this.getAbilities();
					abilities.regeneration = true;
					abilities.healthTicks = parseInt(value);
				} else if (tmpStrValue === "managain") {
					const abilities = this.getAbilities();
					abilities.regeneration = true;
					abilities.manaGain = parseInt(value);
				} else if (tmpStrValue === "manaticks") {
					const abilities = this.getAbilities();
					abilities.regeneration = true;
					abilities.manaTicks = parseInt(value);
				} else if (tmpStrValue === "manashield") {
					this.getAbilities().manaShield = parseBool(value);
				} else if (tmpStrValue === "skillsword") {
					this.getAbilities().skills[Skills.SKILL_SWORD] = parseInt(value);
				} else if (tmpStrValue === "skillaxe") {
					this.getAbilities().skills[Skills.SKILL_AXE] = parseInt(value);
				} else if (tmpStrValue === "skillclub") {
					this.getAbilities().skills[Skills.SKILL_CLUB] = parseInt(value);
				} else if (tmpStrValue === "skilldist") {
					this.getAbilities().skills[Skills.SKILL_DISTANCE] = parseInt(value);
				} else if (tmpStrValue === "skillfish") {
					this.getAbilities().skills[Skills.SKILL_FISHING] = parseInt(value);
				} else if (tmpStrValue === "skillshield") {
					this.getAbilities().skills[Skills.SKILL_SHIELD] = parseInt(value);
				} else if (tmpStrValue === "skillfist") {
					this.getAbilities().skills[Skills.SKILL_FIST] = parseInt(value);
				} else if (tmpStrValue === "maxhitpoints") {
					this.getAbilities().stats[Stats.STAT_MAXHITPOINTS] = parseInt(value);
				} else if (tmpStrValue === "maxhitpointspercent") {
					this.getAbilities().statsPercent[Stats.STAT_MAXHITPOINTS] = parseInt(value);
				} else if (tmpStrValue === "maxmanapoints") {
					this.getAbilities().stats[Stats.STAT_MAXMANAPOINTS] = parseInt(value);
				} else if (tmpStrValue === "maxmanapointspercent") {
					this.getAbilities().statsPercent[Stats.STAT_MAXMANAPOINTS] = parseInt(value);
				} else if (tmpStrValue === "magicpoints" || tmpStrValue === "magiclevelpoints") {
					this.getAbilities().stats[Stats.STAT_MAGICPOINTS] = parseInt(value);
				} else if (tmpStrValue === "magicpointspercent") {
					this.getAbilities().statsPercent[Stats.STAT_MAGICPOINTS] = parseInt(value);
				} else if (tmpStrValue === "fieldabsorbpercentenergy") {
					this.getAbilities().fieldAbsorbPercent[combatTypeToIndex(CombatType.COMBAT_ENERGYDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "fieldabsorbpercentfire") {
					this.getAbilities().fieldAbsorbPercent[combatTypeToIndex(CombatType.COMBAT_FIREDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "fieldabsorbpercentpoison" || tmpStrValue === "fieldabsorpercentearth") {
					this.getAbilities().fieldAbsorbPercent[combatTypeToIndex(CombatType.COMBAT_EARTHDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentall" || tmpStrValue === "absorbpercentallelements") {
					const val = parseInt(value);
					const abilities = this.getAbilities();
					for (let key in abilities.absorbPercent) {
						abilities.absorbPercent[key] += val;
					}
				} else if (tmpStrValue === "absorbpercentelements") {
					const val = parseInt(value);
					const abilities = this.getAbilities();
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_ENERGYDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_FIREDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_EARTHDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_ICEDAMAGE)] += val;
				} else if (tmpStrValue === "absorbpercentmagic") {
					const val = parseInt(value);
					const abilities = this.getAbilities();
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_ENERGYDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_FIREDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_EARTHDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_ICEDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_HOLYDAMAGE)] += val;
					abilities.absorbPercent[combatTypeToIndex(CombatType.COMBAT_DEATHDAMAGE)] += val;
				} else if (tmpStrValue === "absorbpercentenergy") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_ENERGYDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentfire") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_FIREDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentpoison" || tmpStrValue === "absorbpercentearth") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_EARTHDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentice") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_ICEDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentholy") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_HOLYDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentdeath") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_DEATHDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentlifedrain") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_LIFEDRAIN)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentmanadrain") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_MANADRAIN)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentdrown") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_DROWNDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentphysical") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_PHYSICALDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercenthealing") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_HEALING)] += parseInt(value);
				} else if (tmpStrValue === "absorbpercentundefined") {
					this.getAbilities().absorbPercent[combatTypeToIndex(CombatType.COMBAT_UNDEFINEDDAMAGE)] += parseInt(value);
				} else if (tmpStrValue === "suppressdrunk") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_DRUNK;
					}
				} else if (tmpStrValue === "suppressenergy") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_ENERGY;
					}
				} else if (tmpStrValue === "suppressfire") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_FIRE;
					}
				} else if (tmpStrValue === "suppresspoison") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_POISON;
					}
				} else if (tmpStrValue === "suppressdrown") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_DROWN;
					}
				} else if (tmpStrValue === "suppressphysical") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_BLEEDING;
					}
				} else if (tmpStrValue === "suppressfreeze") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_FREEZING;
					}
				} else if (tmpStrValue === "suppressdazzle") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_DAZZLED;
					}
				} else if (tmpStrValue === "suppresscurse") {
					if (parseBool(value)) {
						this.getAbilities().conditionSuppressions |= ConditionType.CONDITION_CURSED;
					}
				} else if (tmpStrValue === "field") {
					this.group = ItemGroup.ITEM_GROUP_MAGICFIELD;
					this.type = ItemTypes.ITEM_TYPE_MAGICFIELD;

					let combatType: CombatType = CombatType.COMBAT_NONE;
					let conditionDamage: ConditionDamage = null;

					tmpStrValue = String(value).toLowerCase();
					if (tmpStrValue === "fire") {
						conditionDamage = new ConditionDamage(ConditionId.CONDITIONID_COMBAT, ConditionType.CONDITION_FIRE);
						combatType = CombatType.COMBAT_FIREDAMAGE;
					} else if (tmpStrValue === "energy") {
						conditionDamage = new ConditionDamage(ConditionId.CONDITIONID_COMBAT, ConditionType.CONDITION_ENERGY);
						combatType = CombatType.COMBAT_ENERGYDAMAGE;
					} else if (tmpStrValue === "poison") {
						conditionDamage = new ConditionDamage(ConditionId.CONDITIONID_COMBAT, ConditionType.CONDITION_POISON);
						combatType = CombatType.COMBAT_EARTHDAMAGE;
					} else if (tmpStrValue === "drown") {
						conditionDamage = new ConditionDamage(ConditionId.CONDITIONID_COMBAT, ConditionType.CONDITION_DROWN);
						combatType = CombatType.COMBAT_DROWNDAMAGE;
					} else if (tmpStrValue === "physical") {
						conditionDamage = new ConditionDamage(ConditionId.CONDITIONID_COMBAT, ConditionType.CONDITION_BLEEDING);
						combatType = CombatType.COMBAT_PHYSICALDAMAGE;
					} else {
						console.log(`[Warning - Items::parseItemNode] Unknown field value: ${value}.`);
					}

					if (combatType !== CombatType.COMBAT_NONE) {
						this.combatType = combatType;
						this.conditionDamage.reset(conditionDamage);
						let ticks = 0;
						let damage = 0;
						let start = 0;
						let count = 1;

						if (!Array.isArray(attributeNode))
							attributeNode = [attributeNode];
						for (let subAttributeNode of attributeNode) {
							const subKeyAttribute = attributeNode.key
							if (!subKeyAttribute) {
								continue;
							}

							const subValueAttribute = attributeNode.value;
							if (!subValueAttribute) {
								continue;
							}

							tmpStrValue = String(subKeyAttribute);
							if (tmpStrValue === "ticks") {
								ticks = parseInt(subValueAttribute);
							} else if (tmpStrValue === "count") {
								count = Math.max(1, parseInt(subValueAttribute));
							} else if (tmpStrValue === "start") {
								start = Math.max(0, parseInt(subValueAttribute));
							} else if (tmpStrValue === "damage") {
								damage = -parseInt(subValueAttribute);

								if (start > 0) {
									// std::list < int32_t > damageList;
									// ConditionDamage::generateDamageList(damage, start, damageList);
									// for (int32_t damageValue : damageList) {
									// 	conditionDamage.addDamage(1, ticks, -damageValue);
									// }

									start = 0;
								} else {
									conditionDamage.addDamage(count, ticks, damage);
								}
							}
						}

						conditionDamage.setParam(ConditionParam.CONDITION_PARAM_FIELD, 1);

						if (conditionDamage.getTotalDamage() > 0) {
							conditionDamage.setParam(ConditionParam.CONDITION_PARAM_FORCEUPDATE, 1);
						}
					}
				} else if (tmpStrValue === "replaceable") {
					this.replaceable = parseBool(value);
				} else if (tmpStrValue === "partnerdirection") {
					this.bedPartnerDir = getDirection(String(value));
				} else if (tmpStrValue === "leveldoor") {
					this.levelDoor = parseInt(value);
				} else if (tmpStrValue === "maletransformto" || tmpStrValue === "malesleeper") {
					const val = parseInt(value);
					this.transformToOnUse[PlayerSex.PLAYERSEX_MALE] = val;
					if (this.transformToFree === 0) {
						this.transformToFree = this.serverID;
					}

					if (this.transformToOnUse[PlayerSex.PLAYERSEX_FEMALE] === 0) {
						this.transformToOnUse[PlayerSex.PLAYERSEX_FEMALE] = val;
					}
				} else if (tmpStrValue === "femaletransformto" || tmpStrValue === "femalesleeper") {
					const val = parseInt(value);
					this.transformToOnUse[PlayerSex.PLAYERSEX_FEMALE] = val;

					if (this.transformToFree === 0) {
						this.transformToFree = this.serverID;
					}

					if (this.transformToOnUse[PlayerSex.PLAYERSEX_MALE] === 0) {
						this.transformToOnUse[PlayerSex.PLAYERSEX_MALE] = val;
					}
				} else if (tmpStrValue === "transformto") {
					this.transformToFree = parseInt(value);
				} else if (tmpStrValue === "destroyto") {
					this.destroyTo = parseInt(value);
				} else if (tmpStrValue === "elementice") {
					const abilities = this.getAbilities();
					abilities.elementDamage = parseInt(value);
					abilities.elementType = CombatType.COMBAT_ICEDAMAGE;
				} else if (tmpStrValue === "elementearth") {
					const abilities = this.getAbilities();
					abilities.elementDamage = parseInt(value);
					abilities.elementType = CombatType.COMBAT_EARTHDAMAGE;
				} else if (tmpStrValue === "elementfire") {
					const abilities = this.getAbilities();
					abilities.elementDamage = parseInt(value);
					abilities.elementType = CombatType.COMBAT_FIREDAMAGE;
				} else if (tmpStrValue === "elementenergy") {
					const abilities = this.getAbilities();
					abilities.elementDamage = parseInt(value);
					abilities.elementType = CombatType.COMBAT_ENERGYDAMAGE;
				} else if (tmpStrValue === "walkstack") {
					this.walkStack = parseBool(value);
				} else if (tmpStrValue === "blocking") {
					this.blockSolid = parseBool(value);
				} else if (tmpStrValue === "allowdistread") {
					this.allowDistRead = parseBool(String(value));
				} else {
					console.log(`[Warning - Items::parseItemNode] Unknown key value: ${value}.`);
				}
			}
		}
	}

	public isSplash(): boolean {
		return this.group === ItemGroup.ITEM_GROUP_SPLASH;
	}

	public isGroundTile(): boolean {
		return this.group === ItemGroup.ITEM_GROUP_GROUND;
	}
}

export class ItemFlags {

	private value: number = 0;

	constructor(value: number) {
		this.value = value;
	}

	public hasFlag(flag): boolean {
		return (this.value & flag) !== 0;
	}

}

export class XMLItem {

	private itemObj: any;

	constructor(item: any) {
		this.itemObj = item || {};
	}

	public isValid(): boolean {
		return !!this.getServerID();
	}

	public getObject(): any {
		return this.itemObj;
	}

	public getServerID(): number {
		return parseInt(this.itemObj.id) || 0;
	}
}

export class Item extends Thing {
	static countByType(item: Item, subType: number): number {
		if (subType === -1 || subType === item.getSubType()) {
			return item.count
		}

		return 0;
	}

	public itemType: ItemType;

	public count: number = 1;
	public charges: number = -1;
	public attributes: ItemAttributes = new ItemAttributes();
	protected loadedFromMap: boolean = false;

	constructor(itemType: ItemType) {
		super();
		this.itemType = itemType;

	}

	public replaceWith(newItem: Item): void {
		clearObject(this);
		deepExtend(this, newItem);
	}

	public isGround(): boolean {
		return this.itemType.group === ItemGroup.Ground;
	}

	public getName(): string {
		return this.itemType.name;
	}

	public static create(idOrName: string | number): Item {
		const itemType: ItemType = Items.getItemType(idOrName);
		return new Item(itemType);
	}

	public getMagicField(): MagicField {
		return null;
	}

	public getTeleport(): Teleport {
		return null;
	}

	public getTrashHolder(): TrashHolder {
		return null;
	}

	public getMailbox(): Mailbox {
		return null;
	}

	public getBed(): BedItem {
		return null;
	}

	public hasProperty(property: ItemProperty): boolean {
		return false;
	}

	public hasAttribute(itemAttrType: ItemAttributeType): boolean {
		return false;
	}

	public isHangable(): boolean {
		return false;
	}

	public isBlocking(): boolean {
		return false;
	}

	public isMagicField(): boolean {
		return false;
	}

	public isPickupable(): boolean {
		return this.itemType.isPickupable;
	}

	public isStackable(): boolean {
		return this.itemType.isStackable;
	}

	public getItemCount(): number {
		return this.count;
	}

	public setItemCount(count: number): void {
		this.count = count;
	}

	public isMoveable(): boolean {
		return this.itemType.isMoveable;
	}

	public isReplaceable(): boolean {
		return this.itemType.isReplacable;
	}

	public setSubType(n: number): void {
		const it = this.itemType;
		if (this.isFluidContainer() || this.isSplash()) {
			this.setFluidType(n);
		} else if (this.isStackable) {
			this.setItemCount(n);
		} else if (this.charges !== 0) {
			this.charges = n;
		} else {
			this.count = n;
		}
	}

	public isFluidContainer(): boolean {
		return this.itemType.group === ItemGroup.Fluid;
	}

	public isSplash(): boolean {
		return this.itemType.group === ItemGroup.Splash;
	}

	public getSubType(): number {
		const it = this.itemType;
		if (this.isFluidContainer() || this.isSplash()) {
			return this.getFluidType();
		} else if (this.isStackable) {
			return this.count;
		} else if (this.charges !== 0) {
			return this.charges;
		}

		return this.count;
	}

	public setFluidType(n: number) {
		this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_FLUIDTYPE, n);
	}

	public getFluidType(): number {
		return this.getIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_FLUIDTYPE);
	}

	static isIntAttrType(type: ItemAttributeType): boolean {
		return (type & 0x7FFE13) !== 0;
	}

	public getIntAttr(type: ItemAttributeType): number {
		if (!Item.isIntAttrType(type)) {
			return 0;
		}

		const attr: Attribute = this.getExistingAttr(type);
		if (!attr) {
			return 0;
		}
		return attr.type; // ?????? return attr->value.integer;
	}

	public getExistingAttr(type: ItemAttributeType): Attribute {
	if (this.hasAttribute(type)) {
		const attrList = this.attributes.list;
		for (let it = attrList.begin(), end = attrList.end(); it !== end; it = it.next()) {
			const attribute = it.value;
			if (attribute && attribute.type === type)
				return attribute;
		}
	}
	return null;
}

	public getID(): number {
		return this.itemType.serverID;
	}

	public getServerID(): number {
		return this.itemType.clientID;
	}

	public getItem(): Item {
		return this;
	}

	public startDecaying(): void {
		g_game.startDecay(this);
	}

	public setLoadedFromMap(val: boolean): void {
		this.loadedFromMap = val;
	}

	public setSpecialDescription(desc: string): void {
		this.setStrAttr(ItemAttributeType.ITEM_ATTRIBUTE_DESCRIPTION, desc);
	}

	public setActionId(n: number) {
		if (n < 100) {
			n = 100;
		}

		this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_ACTIONID, n);
	}

	public setText(text: string): void {
		this.setStrAttr(ItemAttributeType.ITEM_ATTRIBUTE_TEXT, text);
	}

	public setDate(n: number): void {
		this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_DATE, n);
	}

	public resetDate(): void {
		this.removeAttribute(ItemAttributeType.ITEM_ATTRIBUTE_DATE);
	}

	public setWriter(writer: string) {
		this.setStrAttr(ItemAttributeType.ITEM_ATTRIBUTE_WRITER, writer);
	}
	public resetWriter(): void {
		this.removeAttribute(ItemAttributeType.ITEM_ATTRIBUTE_WRITER);
	}

	public setDuration(time: number): void {
		this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_DURATION, time);
	}

	public setDecaying(decayState: ItemDecayState) {
		this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_DECAYSTATE, decayState);
	}

	public setStrAttr(type: ItemAttributeType, value: string) {
		this.getAttributes().setStrAttr(type, value);
	}

	public setIntAttr(type: ItemAttributeType, value: number): void {
		this.getAttributes().setIntAttr(type, value);
	}

	public removeAttribute(type: ItemAttributeType): void {
	if (!this.hasAttribute(type)) {
		return;
	}

		let prev_it = this.attributes.list.begin();
		if (prev_it.value.type == type) {
			this.attributes.list.pop_front()
		} else {
			let it = prev_it, end = this.attributes.list.end();
			while ((it = it.next()) !== end) {
				if (it.value.type == type) {
					this.attributes.list.erase(prev_it);
					break;
				}
				prev_it = it;
			}
		}
		this.attributes.attributeBits &= ~type;
	}

	public setUniqueId(n: number): void {
		if (this.hasAttribute(ItemAttributeType.ITEM_ATTRIBUTE_UNIQUEID)) {
			return;
		}

		if (g_game.addUniqueItem(n, this)) {
			this.getAttributes().setUniqueId(n);
		}
	}

	public getAttributes(): ItemAttributes {
		return this.attributes;
	}

	public readAttr(attr: AttrTypes, props: PropertyReader): AttrReadValue {
		switch (attr) {
			case AttrTypes.ATTR_COUNT:
			case AttrTypes.ATTR_RUNE_CHARGES: {
				try {
					const count = props.readUInt8();
					this.setSubType(count);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_ACTION_ID: {
				try {
					const actionId = props.readUInt16();
					this.setActionId(actionId);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_UNIQUE_ID: {
				try {
					const uniqueId = props.readUInt16();
					this.setUniqueId(uniqueId);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_TEXT: {
				try {
					const text = props.readString();
					this.setText(text);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_WRITTENDATE: {
				try {
					const writtenDate = props.readUInt32();
					this.setDate(writtenDate);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_WRITTENBY: {
				try {
					const writer = props.readString();
					this.setWriter(writer);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_DESC: {
				try {
					const text = props.readString();
					this.setSpecialDescription(text);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_CHARGES: {
				try {
					const charges = props.readUInt16();
					this.setSubType(charges);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_DURATION: {
				try {
					const duration = props.readUInt32();
					this.setDuration(Math.max(0, duration));
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_DECAYING_STATE: {
				try {
					const state = props.readUInt8();
					if (state != ItemDecayState.DECAYING_FALSE) {
						this.setDecaying(ItemDecayState.DECAYING_PENDING);
					}
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_NAME: {
				try {
					const string = props.readString();
					this.setStrAttr(ItemAttributeType.ITEM_ATTRIBUTE_NAME, name);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_ARTICLE: {
				try {
					const article = props.readString();
					this.setStrAttr(ItemAttributeType.ITEM_ATTRIBUTE_ARTICLE, article);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_PLURALNAME: {
				try {
					const pluralName = props.readString();
					this.setStrAttr(ItemAttributeType.ITEM_ATTRIBUTE_PLURALNAME, pluralName);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_WEIGHT: {
				try {
					const weight = props.readUInt32();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_WEIGHT, weight);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_ATTACK: {
				try {
					const attack = props.readUInt32();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_ATTACK, attack);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_DEFENSE: {
				try {
					const defense = props.readUInt32();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_DEFENSE, defense);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_EXTRADEFENSE: {
				try {
					const extraDefense = props.readUInt32();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_EXTRADEFENSE, extraDefense);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_ARMOR: {
				try {
					const armor = props.readUInt32();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_ARMOR, armor);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_HITCHANCE: {
				try {
					const hitChance = props.readUInt8();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_HITCHANCE, hitChance);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_SHOOTRANGE: {
				try {
					const shootRange = props.readUInt8();
					this.setIntAttr(ItemAttributeType.ITEM_ATTRIBUTE_SHOOTRANGE, shootRange);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			//these should be handled through derived classes
			//If these are called then something has changed in the items.xml since the map was saved
			//just read the values

			//Depot class
			case AttrTypes.ATTR_DEPOT_ID: {
				try {
					props.skipBytes(2);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			//Door class
			case AttrTypes.ATTR_HOUSEDOORID: {
				try {
					props.skipBytes(1);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			//Bed class
			case AttrTypes.ATTR_SLEEPERGUID: {
				try {
					props.skipBytes(4);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			case AttrTypes.ATTR_SLEEPSTART: {
				try {
					props.skipBytes(4);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			//Teleport class
			case AttrTypes.ATTR_TELE_DEST: {
				try {
					props.skipBytes(5);
				} catch (e) {
					return AttrReadValue.ATTR_READ_ERROR;
				}
				break;
			}

			//Container class
			case AttrTypes.ATTR_CONTAINER_ITEMS: {
				return AttrReadValue.ATTR_READ_ERROR;
			}

			default:
				return AttrReadValue.ATTR_READ_ERROR;
		}

		return AttrReadValue.ATTR_READ_CONTINUE;
	}


	public unserializeAttr(props: PropertyReader): boolean {
		while (props.canRead(1)) {
			const attr_type = props.readUInt8();
			const ret = this.readAttr(<AttrTypes>(attr_type), props);
			if (ret === AttrReadValue.ATTR_READ_ERROR) {
				return false;
			} else if (ret === AttrReadValue.ATTR_READ_END) {
				return true;
			}
		}
		return true;
	}

	public unserializeItemNode(fileLoader: FileLoader, nodeItem: Node, props: PropertyReader) {
		return this.unserializeAttr(props);
	}

}

export class Items {

	public static idMap: Map<number, ItemType> = new Map<number, ItemType>();
	public static nameMap: Map<string, ItemType> = new Map<string, ItemType>();

	private static defaultObject: ItemType = new ItemType();

	public static addItemType(itemType: ItemType): void {
		const itemId = itemType.serverID;
		const itemName = itemType.name;

		Items.idMap.set(itemId, itemType);
		Items.nameMap.set(itemName, itemType);
	}

	public static getItemType(idOrName: string | number): ItemType {
		idOrName = Number(idOrName) || idOrName; // because "3031" and 3031 are different indexes for Map
		let lookMap: Map<string | number, ItemType>;
		if (typeof idOrName === "number") {
			lookMap = Items.idMap;
		} else {
			lookMap = Items.nameMap;
		}

		const ret: ItemType = lookMap.get(idOrName);
		if (ret !== undefined) {
			return ret;
		}

		return Items.defaultObject;
	}

}
