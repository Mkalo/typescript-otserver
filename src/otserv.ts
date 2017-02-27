import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkMessage";
import { Service } from "./server";
import { ProtocolLogin } from "./protocol";
import { Config } from "./config";
import { LoadingText, printInfo } from './loadingText';

export const g_config: Config = new Config();
export const g_rsa: RSA = RSA.getInstance();
const dataDirectory = path.join(__dirname, '..', '..', 'data');

export class Otserv {

	public start() {
		printInfo();

		const service: Service<ProtocolLogin> = new Service<ProtocolLogin>(ProtocolLogin);
		// console.log(service.is_checksummed());
		console.log("Typescripten server is online! <--- LUL");
	}

}
