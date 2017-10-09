import {Instance, Transaction} from "sequelize";
import {IProjectInstance} from "../project/IProject";
import {IUserInstance} from "../user/IUser";
import {ObjectSchema} from "joi";

export interface IRoomAttributes {

    _id?: number;
    name?: string;
    creator?: IUserInstance;
    creatorId?: number;
    projectId?: number;
    project?: IProjectInstance;
}

export interface IRoomInstance  extends Instance<IRoomAttributes>, IRoomAttributes {

    dataValues: IRoomAttributes;
    checkRoomUsers(users: number[]): Promise<this>;
    setRoomUsers(users: number[], tr?: Transaction): Promise<this>;
    associate(models);
}
