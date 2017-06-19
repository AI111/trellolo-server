'use strict';
import {ServerConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
export class ProdConfig extends ServerConfig{
  port = process.env.OPENSHIFT_NODEJS_PORT
|| process.env.PORT
|| 8080;
  seedDB = true;
  dbConfig = {
    dbName: 'trellolo-prod',
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