/**
 * Created by sasha on 6/7/17.
 */
import {Instance} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "../board/IBoard";
import { IProjectInstance} from "../project/IProject";
export interface IInviteAttributes {
    _id?: number;
    title?: string;
    message?: string;
    userFrom?: IUserInstance;
    userTo?: IUserInstance;
    userFromId?: number;
    userToId?: number;
    projectId: number;
}

export interface ITInviteInstance  extends Instance<IInviteAttributes>, IInviteAttributes {
    dataValues: IInviteAttributes;
    associate(models);
}
