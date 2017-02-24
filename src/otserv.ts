import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";
import { Service } from "./server";
import { ProtocolLogin } from "./protocol";
import { ItemType } from "./items";
import { Items } from "./items";
import { ConfigManager } from "./configmanager";

export const g_configmanager: ConfigManager = new ConfigManager();
export const g_rsa: RSA = RSA.getInstance();

export class Otserv {
    
	public start() {
        if (!g_configmanager.load()) throw Error("Unable to load config.js. Did you copy `config.js.sample` to `config.js`?");

		const service: Service<ProtocolLogin> = new Service<ProtocolLogin>(ProtocolLogin);
		console.log(service.is_checksummed());
		console.log("Server started!");
	}

}