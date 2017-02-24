class Config {
    world: {
        type: string;
        name: string;
        motd: string;
    };

    connection: {
        ip: string;
        loginPort: number;
        gamePort: number;
    }

    db: {
        type: string;
        host: string;
        port: number;
        user: string;
        password: string;
    };
}

export class ConfigManager {

    private config: Config;

    public load(): boolean {
        let loadedConfig;
        try {
            loadedConfig = require('../config.js');
        } catch (e) {
            return false;
        }

        this.config = loadedConfig.default;
        console.log(typeof(this.config.db.port) + ", " + this.config.db.port);
        return true;
    }
}
