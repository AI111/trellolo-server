/**
 * Created by sasha on 6/7/17.
 */
import {Instance} from "sequelize";
import {IDBInstance} from "../IDBInstance";
import {IRoomAttributes} from "../room/IRoom";
import {IUserAttributes} from "../user/IUser";

export interface IMessageAttributes extends IDBInstance{
    _id?: number;
    message?: string;
    userId?: number;
    sender?: IUserAttributes;
    roomId?: number;
    room?: IRoomAttributes;
}

export interface IMessageInstance  extends Instance<IMessageAttributes>, IMessageAttributes {
    dataValues: IMessageAttributes;
}

export enum RoomEvents {
    ADD_MESSAGE = "ADD_MESSAGE",
    EDIT_MESSAGE = "EDIT_MESSAGE",
    USER_JOIN = "JOIN_USER",
    USER_LEAVE = "LEAVE_USER",
}
export enum RoomUserEvents {
    JOIN_ROOM = "JOIN_ROOM",
    LEAVE_ROOM = "LEAVE_ROOM",
}
