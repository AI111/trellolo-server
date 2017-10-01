import {Instance} from "sequelize";
import {IProjectInstance} from "../project/IProject";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "../board/IBoard";
export type  RoomAccessRights = "user"| "admin" | "creator";

export interface IRoomToUserAttributes {
    _id?: number;
    name?: string;
    userId?: number;
    user?: IUserInstance;
    boardId?: number;
    board?: IBoardInstance;
    accessRights?: RoomAccessRights;
}

export interface IRoomToUserMessageInstance  extends Instance<IRoomToUserAttributes>, IRoomToUserAttributes {
    dataValues: IRoomToUserAttributes;
    associate(models);
}
