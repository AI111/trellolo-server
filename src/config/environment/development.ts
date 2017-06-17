'use strict';
import {ServerConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export class DevConfig extends ServerConfig{
  seedDB: true;
  secrets = {
    session: 'trellolo & trollolo'
  };
  dbConfig = {
    dbName: 'trellolo-dev',
    name: 'root',
    password: 'hello',
    options: {
      host: 'localhost',
      port: 3306,
      dialect: 'mysql',
      logging: console.log
    }
  };
}
