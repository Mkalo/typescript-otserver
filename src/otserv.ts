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
import { WorldMap } from './worldMap';
import { mongoose, models } from './db';
import { waterfall, eachSeries } from 'async';

export const g_config: Config = new Config();
export const g_rsa: RSA = RSA.getInstance();
export const g_game: Game = new Game();
const dataDirectory = path.join(__dirname, '..', '..', 'data');
const uri = g_config.db.generateURI();
export let g_map: WorldMap = new WorldMap();

const world = g_config.worlds[0];

export class Otserv {

	public start() {

		waterfall([
			setupDBConnection,
			recreateDB,
			loadItems,
			loadMap,
			startServices
		], (err, results) => {
			if (err) return console.error(err);

			console.log('Server is online!');
		});
	}

}

const setupDBConnection = (done: (err: Error) => void) => {
	mongoose.connect(uri, err => {
		if (err) return done(err);
		console.log('Connected to MongoDb');

		return done(null);
	});
};

const recreateDB = (done: (err: Error) => void) => {
	const amountOfCharactersToCreate = 5;
	console.log('Dropping database.');
	mongoose.connection.db.dropDatabase((err) => {
		if (err) return done(err);

		console.log('Creating default account.');
		new models.Account({
			login: "11",
			password: "11",
			email: "dsdadasd@op.pl"
		}).save().then((account) => {
			console.log('Creating default characters.');
			const accountId = account._id;

			let i = 0;
			eachSeries(Array(amountOfCharactersToCreate).fill(0), (item, callback) => {
				new models.Player({
					account: accountId,
					name: "Elderapo" + i++,
					health: 100,
					maxHealth: 100
				}).save().then((player) => {
					return done(null);
				}).catch((err) => {
					return done(err);
				});
			}, done);
		}).catch((err) => {
			return done(err);
		});
	});
};

const loadItems = (done: (err: Error) => void) => {
	try {
		console.log("Loading items...");
		const itemsFileName = path.join(dataDirectory, world.itemsFileName);
		const otbLoader = new OTBLoader();
		if (!otbLoader.loadItems(itemsFileName))
			return done(new Error(`Couldn't load items from ${itemsFileName}!`));

		return done(null);
	} catch (e) {
		return done(e);
	}
};

const loadMap = (done: (err: Error) => void) => {
	try {
		console.log("Loading map...");
		const mapFileName = path.join(dataDirectory, world.mapFileName);
		if (!g_map.loadMap(mapFileName, true))
			return done(new Error(`Couldn't load map from ${mapFileName}!`));

		// const floor = g_map.getFloor(7);
		const sqms = [];

		for (let x = 1016; x < 1016 + 10; x++) {
			for (let y = 1019; y < 1019 + 10; y++) {
				const tile = g_map.getTile(x, y, 7);
				sqms.push(tile);
			}
		}

		return done(null);
	} catch (e) {
		return done(e);
	}
};

const startServices = (done: (err: Error) => void) => {
	try {
		const serviceManager: ServerManager = new ServerManager();
		serviceManager.addService<ProtocolLogin>(ProtocolLogin, g_config.loginServer.port);
		serviceManager.addService<ProtocolGame>(ProtocolGame, g_config.worlds[0].port);
		serviceManager.run();
	} catch (e) {
		return done(e);
	}

	return done(null);
};