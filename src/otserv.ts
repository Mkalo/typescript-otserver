import * as path from 'path';
import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkMessage";
import { ServerManager } from "./server";
import { ProtocolLogin, ProtocolGame } from "./protocols";
import { Config } from "./config";
import { OTBLoader } from './OTBLoader';
import { OTBMLoader } from './OTBMLoader';
import { Game } from './game';

import * as mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import * as models from './models';

export const g_config: Config = new Config();
export const g_rsa: RSA = RSA.getInstance();
export const g_game: Game = new Game();
const dataDirectory = path.join(__dirname, '..', '..', 'data');

export class Otserv {

	public start() {

		let uri = 'mongodb://localhost/ots';
		mongoose.connect(uri, err => {
			if (err) throw Error(err);
			console.log('Connected to MongoDb');

			// const acc = new models.Account({
			// 	login: "tomek",
			// 	password: "123",
			// 	email: "dsdadasd@op.pl"
			// });

			// acc.save();

			const serviceManager: ServerManager = new ServerManager();
			serviceManager.addService<ProtocolLogin>(ProtocolLogin, g_config.loginServer.port);
			serviceManager.addService<ProtocolGame>(ProtocolGame, g_config.worlds[0].port);
			serviceManager.run();
		});
	}

}
