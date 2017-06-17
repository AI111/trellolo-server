'use strict';
import {ServerConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================

export class TestConfig extends ServerConfig{
  seedDB = true;
  dbConfig = {
    uri: 'sqlite://',
    options: {
      host: 'localhost',
      port: 3306,
      dialect: 'test.sqlite',
      logging: console.log
    }
  };
}