import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";
import { Service } from "./server";
import { ProtocolLogin } from "./protocol";
import { Config } from "./config";
import { OTBLoader } from './OTB-loader';
import { OTBMLoader } from './OTBM-loader';
import { LoadingText, printInfo } from './loading-text';

export const g_config: Config = new Config();
export const g_rsa: RSA = RSA.getInstance();
const dataDirectory = path.join(__dirname, '..', '..', 'data');

export class Otserv {

	public start() {
		printInfo();
		const loadingItemsText = new LoadingText("Loading items");
		const itemsFileName = path.join(dataDirectory, g_config.world.itemsFileName);
		const otbLoader = new OTBLoader();
		otbLoader.loadItems(itemsFileName);
		loadingItemsText.stop();

		const loadingMapText = new LoadingText("Loading map");
		const mapFileName = path.join(dataDirectory, g_config.world.mapFileName);
		const otbmLoader = new OTBMLoader();
		otbmLoader.load(mapFileName);
		loadingMapText.stop();

		const service: Service<ProtocolLogin> = new Service<ProtocolLogin>(ProtocolLogin);
		// console.log(service.is_checksummed());
		console.log("Typescripten server is online! <--- LUL");
	}

}