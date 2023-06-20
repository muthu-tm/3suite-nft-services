'use strict';

import nconf from 'nconf';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let env = (process.env.NODE_ENV || 'dev');
const __dirname = path.dirname(__filename);

class Environment {

    constructor() {
        this._config;
    }

    get isProduction() {
        return (env === "prod");
    }

    get isDevelopment() {
        return (env === "dev");
    }    

    get config() {
        if(this._config) {
            return this._config;
        }

        // First consider commandline arguments and environment variables, respectively.
        nconf.argv().env();

        // Then load configuration from a designated file.
        // let configFileDir = __dirname + "/../config/";
        let configFile = (process.env.NODE_ENV || 'dev') + '.json';
        var jsonPath = path.join(__dirname, '..', 'config', configFile);

        console.log(`...Loading config file from ${jsonPath}`);
        nconf.file({ file: jsonPath });

        // Provide default values for settings not provided above.
        nconf.defaults({});

        this._config = nconf;
        return this._config;
    }
}

let environment = new Environment();
export default  environment;
