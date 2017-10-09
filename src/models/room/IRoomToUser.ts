import {Instance} from "sequelize";
import {IBoardInstance} from "../board/IBoard";
import {IUserInstance} from "../user/IUser";
import {IRoomAttributes} from "./IRoom";
export type  RoomAccessRights = "user"| "admin" | "creator";

export interface IRoomToUserAttributes {
    _id?: number;
    name?: string;
    userId?: number;
    user?: IUserInstance;
    roomId?: number;
    room?: IRoomAttributes;
    accessRights?: RoomAccessRights;
}

export interface IRoomToUserMessageInstance  extends Instance<IRoomToUserAttributes>, IRoomToUserAttributes {
    dataValues: IRoomToUserAttributes;
    associate(models);
}
