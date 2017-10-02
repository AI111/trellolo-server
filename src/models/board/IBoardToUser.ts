/**
 * Created by sasha on 6/7/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IColumnAttributes} from "./IColumn";
import {IBoardAttributes} from "./IBoard";
export type  BoardAccessRights = "user"| "admin" | "creator";

export interface IBoardToUserAttributes {
    _id?: number;
    name?: string;
    board?: IBoardAttributes;
    boardId?: number;
    user?: IUserInstance;
    userId?: number;
    accessRights?: BoardAccessRights;
}

export interface IBoardToUserInstance  extends Instance<IBoardToUserAttributes>, IBoardToUserAttributes {
    dataValues: IBoardToUserAttributes;
}
