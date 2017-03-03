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

		const uri = g_config.db.generateURI();
		mongoose.connect(uri, err => {
			if (err) throw Error(err);
			console.log('Connected to MongoDb');

			// new models.Account({
			// 	login: "11",
			// 	password: "11",
			// 	email: "dsdadasd@op.pl"
			// }).save().then((account) => {
			// 	const accountId = account._id;

			// 	for (let i = 0; i < 500; i++) { // 500 is way to much but just for tests
			// 		new models.Player({
			// 			account: accountId,
			// 			name: "Elderapo" + i
			// 		}).save().then((player) => {

			// 		}).catch((err) => {
			// 			console.log(err);
			// 		});
			// 	}
			// }).catch((err) => {
			// 	console.log(err);
			// });

			const serviceManager: ServerManager = new ServerManager();
			serviceManager.addService<ProtocolLogin>(ProtocolLogin, g_config.loginServer.port);
			serviceManager.addService<ProtocolGame>(ProtocolGame, g_config.worlds[0].port);
			serviceManager.run();
		});
	}

}
