/**
 * Sequelize initialization module
 */

'use strict';

import * as path from 'path';
import {Config as config} from '../config/environment/index';
import * as Sequelize from 'sequelize';
import {UserInstance, UserAttributes} from "../models/user/IUser";

const connection = new Sequelize(config.dbConfig.dbName, config.dbConfig.name,config.dbConfig.password,
    config.dbConfig.options);
export class DBConnection{
    public connection: Sequelize.Sequelize=connection;
    // public Thing: Sequelize.Model<any,any> = connection.import('../api/thing/user.model');
    public User: Sequelize.Model<UserInstance, UserAttributes> =  connection.import('../api/user/user.model') as  Sequelize.Model<UserInstance, UserAttributes>;
}




export const db = new DBConnection();
