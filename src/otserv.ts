import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";
import { Service } from "./server";
import { ProtocolLogin } from "./protocol";
import { ItemType } from "./items";
import { Items } from "./items";
import { Config } from "./config";
import { OTBLoader } from './OTB-loader';
import { OTBMLoader } from './OTBM-loader';

export const g_config: Config = new Config();
export const g_rsa: RSA = RSA.getInstance();
const dataDirectory = path.join(__dirname, '..', '..', 'data');
    
export class Otserv {
    
	public start() {
		console.log("Loading items...");
		const itemsName = path.join(dataDirectory, g_config.world.itemsFileName);
		const otbLoader = new OTBLoader();
		const items = otbLoader.loadItems(itemsName);


		console.log("Loading map...");
		const mapName = path.join(dataDirectory, g_config.world.mapFileName);
		const otbmLoader = new OTBMLoader();
		otbmLoader.load(mapName);

		const service: Service<ProtocolLogin> = new Service<ProtocolLogin>(ProtocolLogin);
		console.log(service.is_checksummed());
		console.log("Server started!");
	}

}