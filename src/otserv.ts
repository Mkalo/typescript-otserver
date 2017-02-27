import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";
import { ServiceManager } from "./server";
import { ProtocolLogin } from "./protocol";
import { Config } from "./config";
import { OTBLoader } from './OTB-loader';
import { OTBMLoader } from './OTBM-loader';

export const g_config: Config = new Config();
export const g_rsa: RSA = RSA.getInstance();
const dataDirectory = path.join(__dirname, '..', '..', 'data');
    
export class Otserv {
    
	public start() {
		console.log("Loading items...");
		const itemsFileName = path.join(dataDirectory, g_config.world.itemsFileName);
		const otbLoader = new OTBLoader();
		otbLoader.loadItems(itemsFileName);

		console.log("Loading map...");
		const mapFileName = path.join(dataDirectory, g_config.world.mapFileName);
		const otbmLoader = new OTBMLoader();
		otbmLoader.load(mapFileName);

        const serviceManager: ServiceManager = new ServiceManager();
        serviceManager.addService<ProtocolLogin>(ProtocolLogin, 7171);
        serviceManager.run();
        
        console.log("Server started!");
	}

}