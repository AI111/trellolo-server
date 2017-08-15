/**
 * Sequelize initialization module
 */


"use strict";

import * as Sequelize from "sequelize";
import {Associations, Model} from "sequelize";
import {Config as config} from "../config/environment/index";
import {IBoardAttributes, IBoardInstance} from "../models/board/IBoard";
import {IBoardToUserAttributes, IBoardToUserInstance} from "../models/board/IBoardToUser";
import {ICardAttributes, ICardInstance} from "../models/board/ICard";
import {IColumnAttributes, IColumnInstance} from "../models/board/IColumn";
import {IProjectAttributes, IProjectInstance} from "../models/project/IProject";
import {ITeamAttributes, ITeamInstance} from "../models/team/ITeam";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {IInviteAttributes, ITInviteInstance} from "../models/invite/IInvite";
const connection = config.env === "test" && new Sequelize(config.dbConfig.uri, config.dbConfig.options) ||
    new Sequelize(config.dbConfig.dbName, config.dbConfig.name, config.dbConfig.password,
    config.dbConfig.options);
export class DBConnection {
    public connection: Sequelize.Sequelize= connection;
    // public Thing: Sequelize.Model<any,any> = connection.import('../api/thing/user.model');
    public User: Sequelize.Model<IUserInstance, IUserAttributes> =  connection.import("../api/user/user.model");
    public Project: Sequelize.Model<IProjectInstance, IProjectAttributes> =
        connection.import("../api/project/project.model");
    public Board: Sequelize.Model<IBoardInstance, IBoardAttributes> =  connection.import("../api/board/board.model");
    public BoardToUser: Sequelize.Model<IBoardToUserInstance, IBoardToUserAttributes> =
        connection.import("../api/board/board-user.model");
    public BoardColumn: Sequelize.Model<IColumnInstance, IColumnAttributes> =
        connection.import("../api/column/column.model");
    public Card: Sequelize.Model<ICardInstance, ICardAttributes> =  connection.import("../api/card/card.model");
    public Team: Sequelize.Model<ITeamInstance, ITeamAttributes> =  connection.import("../api/team/team.model");
    public Invite: Sequelize.Model<ITInviteInstance, IInviteAttributes> =
        connection.import("../api/invite/invite.model");
    constructor(){
        console.log("DBConnection constructor");
        for (const pr in this){
           if ((this[pr] as any).associate)(this[pr] as any).associate(connection.models);
        }
    }
}
export const db = new DBConnection();
