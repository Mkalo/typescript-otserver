let loadedItems = []

export class ItemType {
    private id: number;
    private name: string;
    constructor(arg: number | string) {
        this.id = typeof arg === "number" ? arg : loadedItems[arg];
        this.name = typeof arg === "string" ? arg : loadedItems[arg];
    }
    getId(): number {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
}

export class Items {
    static loadItems(): boolean {
        let items: any = null;
        try {
            items = require("../items.js");
        } catch (e) {
            return false;
        }
        
        for (let itemdata of items.default) {
            let id:number = itemdata.id;
            let name:string = itemdata.name;
            loadedItems[id] = name;
            loadedItems[name] = id;
        }
    }
}