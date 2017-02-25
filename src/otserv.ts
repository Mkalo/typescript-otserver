import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";
import { Service } from "./server";
import { ProtocolLogin } from "./protocol";
import { ItemType } from "./items";
import { Items } from "./items";
import { ConfigManager } from "./configmanager";
import { OTBLoader } from './OTB-loader';
import { OTBMLoader } from './OTBM-loader';

export const g_configmanager: ConfigManager = new ConfigManager();
export const g_rsa: RSA = RSA.getInstance();
    
export class Otserv {
    
	public start() {
        if (!g_configmanager.load()) throw Error("Unable to load config.js. Did you copy `config.js.sample` to `config.js`?");
    
    
    const dataDir = path.join(__dirname, '..', '..', 'data');

		console.log("Loading items...");
		const itemsName = path.join(dataDir, 'items');
		const otbLoader = new OTBLoader();
		const items = otbLoader.loadItems(itemsName);


		console.log("Loading map...");
		const mapName = path.join(dataDir, 'map');
		const otbmLoader = new OTBMLoader();
		otbmLoader.load(mapName);

		const service: Service<ProtocolLogin> = new Service<ProtocolLogin>(ProtocolLogin);
		console.log(service.is_checksummed());
		console.log("Server started!");
	}

}