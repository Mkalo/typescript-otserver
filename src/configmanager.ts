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
	type: string = 'pvp';
	name: string = 'Typescripten';
	motd: string = 'Message of the day!';
}

class Config {
	constructor(obj: Object) {
		deepExtend(this, obj);
	}

    world: WorldConfig = new WorldConfig();
    connection: ConnectionConfig = new ConnectionConfig();
    db: DBConfig = new DBConfig();
}

export class ConfigManager {

    private config: Config;

    public load(): boolean {
        let loadedConfig;
        try {
            loadedConfig = require('../config.js').default;
        } catch (e) {
            return false;
        }

        this.config = new Config(loadedConfig);
        console.log(typeof(this.config.db.port) + ", " + this.config.db.port);
        return true;
    }
}
