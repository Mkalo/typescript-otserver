import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";
import { Service } from "./server";
import { ProtocolLogin } from "./protocol";
import { OTBLoader } from './OTB-loader';
import { OTBMLoader } from './OTBM-loader';

export class Otserv {
	config: Object;

	constructor(config: Object) {
		this.config = config;
	}

	start() {
		const dataDir = path.join(__dirname, '..', '..', 'data');

		console.log("Loading items...");
		const itemsName = path.join(dataDir, 'items');
		const otbLoader = new OTBLoader();
		const items = otbLoader.loadItems(itemsName);


		console.log("Loading map...");
		const mapName = path.join(dataDir, 'map');
		const otbmLoader = new OTBMLoader();
		otbmLoader.load(mapName);

		/*let g_rsa: RSA = RSA.getInstance();
		let text: string = 'Hello RSA!';
		let encrypted: string = g_rsa.getRSA().encrypt(text, 'base64');
		console.log('encrypted: ', encrypted);
		let decrypted: string = g_rsa.getRSA().decrypt(encrypted, 'utf8');
		console.log('decrypted: ', decrypted);
	
		let msg: NetworkMessage = new NetworkMessage();
		let xtea: XTEA = new XTEA(new Uint32Array([121324, 105464, 50055, 312015]));
		msg.addString("Mkalo is awesome.");
		console.log("Original: ");
		console.log(msg.getLength());
		for(var i = 0; i < msg.getLength(); i++) {
		  console.log(i + ": " + msg.getOutputBuffer()[i]);
		}
		console.log("Encrypted: ");
		xtea.encrypt(msg);
		console.log(msg.getLength());
		for(var i = 0; i < msg.getLength(); i++) {
		  console.log(i + ": " + msg.getOutputBuffer()[i]);
		}*/

		let service: Service<ProtocolLogin> = new Service<ProtocolLogin>(ProtocolLogin);
		console.log(service.is_checksummed());

		console.log("Server started!");
	}
}
