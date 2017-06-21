/**
 * Sequelize initialization module
 */

"use strict";

import * as Sequelize from "sequelize";
import {Config as config} from "../config/environment/index";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {Model} from "sequelize";
import {IProjectAttributes, IProjectInstance} from "../models/project/IProject";
import {IBoardAttributes, IBoardInstance} from "../models/board/IBoard";
import {IColumnAttributes, IColumnInstance} from "../models/board/IColumn";
import {ICardAttributes, ICardInstance} from "../models/board/ICard";

const connection = config.env === 'test' &&new Sequelize(config.dbConfig.uri, config.dbConfig.options) ||
    new Sequelize(config.dbConfig.dbName, config.dbConfig.name, config.dbConfig.password,
    config.dbConfig.options);
export class DBConnection{
    public connection: Sequelize.Sequelize= connection;
    // public Thing: Sequelize.Model<any,any> = connection.import('../api/thing/user.model');
    public User: Model<IUserInstance, IUserAttributes> =  connection.import("../api/user/user.model") as Model<IUserInstance, IUserAttributes>;
    public Project: Model<IProjectInstance,IProjectAttributes> =  connection.import("../api/project/project.module") as  Model<IProjectInstance,IProjectAttributes>;
    public Board: Model<IBoardInstance,IBoardAttributes> =  connection.import("../api/board/board.model") as  Model<IBoardInstance,IBoardAttributes>;
    public ProjectColumn: Model<IColumnInstance,IColumnAttributes> =  connection.import("../api/board/column.model.ts") as  Model<IColumnInstance,IColumnAttributes>;
    public Card: Model<ICardInstance,ICardAttributes> =  connection.import("../api/board/card.model") as  Model<ICardInstance,ICardAttributes>;

}
export const db = new DBConnection();
