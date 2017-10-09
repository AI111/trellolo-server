/**
 * Sequelize initialization module
 */


"use strict";

import * as Sequelize from "sequelize";
import {config as config} from "../config/environment/index";
import {IActivityAttributes, IActivityInstance} from "../models/activity/IActivity";
import {IActivityMessageAttributes, IActivityMessageInstance} from "../models/activity/IActivityMessage";
import {IBoardAttributes, IBoardInstance} from "../models/board/IBoard";
import {IBoardToUserAttributes, IBoardToUserInstance} from "../models/board/IBoardToUser";
import {ICardAttributes, ICardInstance} from "../models/board/ICard";
import {IColumnAttributes, IColumnInstance} from "../models/board/IColumn";
import {IInviteAttributes, ITInviteInstance} from "../models/invite/IInvite";
import {IProjectAttributes, IProjectInstance} from "../models/project/IProject";
import {IRoomAttributes, IRoomInstance} from "../models/room/IRoom";
import {IRoomToUserAttributes, IRoomToUserMessageInstance} from "../models/room/IRoomToUser";
import {ITeamAttributes, ITeamInstance} from "../models/team/ITeam";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {IMessageAttributes, IMessageInstance} from "../models/message/IMessage";

const connection = config.env === "test"
    && new Sequelize(config.dbConfig.uri, config.dbConfig.options)
    || new Sequelize(config.dbConfig.dbName, config.dbConfig.name, config.dbConfig.password, config.dbConfig.options);

export class DBConnection {
    public connection: Sequelize.Sequelize = connection;
    public Activity: Sequelize.Model<IActivityInstance, IActivityAttributes>= connection.import("../api/activity/activity.model");
    public ActivityMessage: Sequelize.Model<IActivityMessageInstance, IActivityMessageAttributes> = connection.import("../api/activity/activity.message.model");
    public User: Sequelize.Model<IUserInstance, IUserAttributes> =  connection.import("../api/user/user.model");
    public Project: Sequelize.Model<IProjectInstance, IProjectAttributes> = connection.import("../api/project/project.model");
    public Board: Sequelize.Model<IBoardInstance, IBoardAttributes> =  connection.import("../api/board/board.model");
    public BoardToUser: Sequelize.Model<IBoardToUserInstance, IBoardToUserAttributes> = connection.import("../api/board/board-user.model");
    public BoardColumn: Sequelize.Model<IColumnInstance, IColumnAttributes> = connection.import("../api/column/column.model");
    public Card: Sequelize.Model<ICardInstance, ICardAttributes> =  connection.import("../api/card/card.model");
    public Team: Sequelize.Model<ITeamInstance, ITeamAttributes> =  connection.import("../api/team/team.model");
    public Invite: Sequelize.Model<ITInviteInstance, IInviteAttributes> = connection.import("../api/invite/invite.model");
    public Room: Sequelize.Model<IRoomInstance, IRoomAttributes> = connection.import("../api/room/room.model");
    public UserToRoom: Sequelize.Model<IRoomToUserMessageInstance, IRoomToUserAttributes> = connection.import("../api/room/user-room.model");
    public Message: Sequelize.Model<IMessageInstance, IMessageAttributes> = connection.import("../api/message/message.model");
    constructor() {
        for (const pr in this) {
            if ((this[pr] as any).associate)(this[pr] as any).associate(connection.models);
        }
    }
}
export const db = new DBConnection();
