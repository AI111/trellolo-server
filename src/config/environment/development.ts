"use strict";
import {ServerConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export class DevConfig extends ServerConfig{
  seedDB: true;
  secrets = {
    session: "trellolo & trollolo",
    reCaptchaSecrer: "6LcVDiYUAAAAAFrTfOqmiGwZOnSxbi-Oz-VGA64b",
  };
  dbConfig = {
    dbName: "trellolo-dev",
    name: "root",
    password: "hello",
    options: {
      host: "localhost",
      port: 3306,
      dialect: "mysql",
      logging: console.log,
    },
  };
}
