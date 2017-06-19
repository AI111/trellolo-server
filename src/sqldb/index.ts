/**
 * Sequelize initialization module
 */

"use strict";

import * as path from "path";
import * as Sequelize from "sequelize";
import {Config as config} from "../config/environment/index";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {Model} from "sequelize";

const connection = new Sequelize(config.dbConfig.dbName, config.dbConfig.name, config.dbConfig.password,
    config.dbConfig.options);
export class DBConnection{
    public connection: Sequelize.Sequelize= connection;
    // public Thing: Sequelize.Model<any,any> = connection.import('../api/thing/user.model');
    public User: Model<IUserInstance, IUserAttributes> =  connection.import("../api/user/user.model") as Model<IUserInstance, IUserAttributes>;
}
export const db = new DBConnection();
