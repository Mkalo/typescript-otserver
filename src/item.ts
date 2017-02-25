import * as Enums from './enums';

export class ItemInfo {
	public serverID: number;
	public spriteId: number = 100;
	public weight: number = 0.0;
	public name: string;
	public description: string;
	public article: string;
	public pluralName: string;
	public specialDescription: string;
	public runeSpellName: string;
	public armor: number = 0;
	public volume: number = 0;
	public attack: number = 0;
	public defense: number = 0;
	public extraAttack: number = 0;
	public extraDefense: number = 0;
	public rotateTo: number = 0;
	public showCount: boolean = false;
	public floorChangeDirection: Enums.FloorChangeDirection = Enums.FloorChangeDirection.None;
	public corpseType: Enums.CorpseType = Enums.CorpseType.None;
	public fluid: Enums.FluidType = Enums.FluidType.Empty;
	public maxTextLength: number = 0;
	public writeOnceItemId: number = 0;
	public slotType: Enums.SlotType = Enums.SlotType.None;
	public weaponType: Enums.WeaponType = Enums.WeaponType.None;
	public projectileType: Enums.ProjectileType = Enums.ProjectileType.None;
	public ammoType: Enums.AmmoType = Enums.AmmoType.None;
	public group: number = 0;
	public effect: Enums.Effect = Enums.Effect.None;
	public range: number = 0;
	public stopDuration: number = 0;
	public decayTo: number = 0;
	public transformEquipTo: number = 0;
	public transformDequipTo: number = 0;
	public duration: number = 0;
	public showDuration: boolean = false;
	public charges: number = 0;
	public showCharges: boolean = false;
	public breakChance: number = 0;
	public speed: number = 0;
	public isAlwaysOnTop: boolean = false;
	public topOrder: number = 0;
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
	public isWriteable: boolean = false;
	public hasClientCharges: boolean = false;
	public canLookThrough: boolean = false;

	public hasExtraByte: boolean = false;

	private static itemInfoDictionary: Map<number, ItemInfo> = new Map<number, ItemInfo>();

	public extend(xmlItem: XMLItem) {
		const obj = xmlItem.getObject();
		if (obj.name)
			this.name = obj.name;

		// extend main object by all xml properties
	}

	public static getSpriteId(itemId: number): number {
		return this.getItemInfo(itemId).spriteId;
	}

	public static getItemInfo(itemId: number): ItemInfo {
		return this.itemInfoDictionary[itemId];
	}

}

export class ItemFlags {
	private value: number;

	constructor(value: number) {
		this.value = value;
	}

	public hasFlag(flag): boolean {
		return (this.value & flag) !== 0;
	}
};

export class ItemType {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class XMLItem {
	private itemObj: any;
	
	constructor(item: any) {
		this.itemObj = item || {};
	}

	public isValid() {
		return !!this.getServerID();
	}

	public getObject() {
		return this.itemObj;
	}

	public getServerID() {
		return this.itemObj.id || 0;
	}
}

export class Items {
    public idMap: Map<number, ItemType>;
    public nameMap: Map<string, ItemType>;

    private static defaultObject: ItemType = new ItemType(0, "");

    constructor() {
        this.idMap = new Map<number, ItemType>();
        this.nameMap = new Map<string, ItemType>();
    }

    addItem(itemType: ItemType) {
        const itemId = itemType.id;
        const itemName = itemType.name;

        this.idMap.set(itemId, itemType);
        this.nameMap.set(itemName, itemType);
    }

    getItem(idOrName: string | number): ItemType {
        let lookMap: Map<string | number, ItemType>;
        if (typeof idOrName == "number") {
            lookMap = this.idMap;
        } else {
            lookMap = this.nameMap;
        }

        const ret: ItemType = lookMap.get(idOrName);
        if (ret !== undefined) {
            return ret;
        }

        return Items.defaultObject;
    }
}
