import * as deepExtend from 'deep-extend';

class DBConfig {
	type: string = 'mysql';
	host: string = '127.0.0.1';
	port: number = 3306;
	user: string = 'root';
	password: string = '';
	dbName: string = 'some_ots';
}

class ConnectionConfig {
	host: string = '127.0.0.1';
	loginPort: number = 7171;
	gamePort: number = 7172;
}

class WorldConfig {
	mapFileName: string = 'map';
	itemsFileName: string = 'items';
	type: string = 'pvp';
	name: string = 'Typescripten';
	motd: string = 'Message of the day!';
}

export class Config {
    public world: WorldConfig = new WorldConfig();
    public connection: ConnectionConfig = new ConnectionConfig();
    public db: DBConfig = new DBConfig();

	constructor() {
		try {
			const loadedConfig = require('../config.js').default;
			deepExtend(this, loadedConfig);
		} catch (e) {
			throw Error("Unable to load config.js. Did you copy `config.js.sample` to `config.js`?");
		}
	}
}
