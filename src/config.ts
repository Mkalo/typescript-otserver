import * as deepExtend from 'deep-extend';

class DBConfig {
	public type: string = 'mysql';
	public host: string = '127.0.0.1';
	public port: number = 3306;
	public user: string = 'root';
	public password: string = '';
	public dbName: string = 'some_ots';
}

class ConnectionConfig {
	public host: string = '127.0.0.1';
	public loginPort: number = 7171;
	public gamePort: number = 7172;
}

class WorldConfig {
	public mapFileName: string = 'map';
	public itemsFileName: string = 'items';
	public type: string = 'pvp';
	public name: string = 'Typescripten';
	public motd: string = 'Message of the day!';
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
