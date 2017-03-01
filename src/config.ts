import * as deepExtend from 'deep-extend';

class DBConfig {
	public type: string = 'mysql';
	public host: string = '127.0.0.1';
	public port: number = 3306;
	public user: string = 'root';
	public password: string = '';
	public dbName: string = 'some_ots';
}

class WorldConfig {
	name: string = 'Typescripten';
	type: string = 'pvp';
	mapFileName: string = 'map';
	itemsFileName: string = 'items';
	ip: string = "127.0.0.1";
	port: number = 7172;
}

class GameConfig {
	freePremium: boolean = true;
	motd: string = "dasdadasdas";
}

class LoginServerConfig {
	port: number = 7171;
}

export class Config {

	public loginServer: LoginServerConfig;
	public worlds: WorldConfig[];
    public db: DBConfig;
	public game: GameConfig;

	constructor() {
		this.loginServer = new LoginServerConfig();
		this.worlds = [];
		this.db = new DBConfig();
		this.game = new GameConfig();

		try {
			this.loadConfig();
		} catch (e) {
			throw Error("Unable to load config.js. Did you copy `config.js.sample` to `config.js`?");
		}
	}

	private loadConfig() {
		const loadedConfig = require('../config.js').default;

		deepExtend(this.loginServer, loadedConfig.loginServer);
		deepExtend(this.db, loadedConfig.db);
		deepExtend(this.game, loadedConfig.game);

		const configWorlds = loadedConfig.worlds || [];

		for (let i = 0; i < configWorlds.length; i++) {
			const world = new WorldConfig();
			deepExtend(world, configWorlds[i]);
			this.worlds.push(world);
		}
	}
}
