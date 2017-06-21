/**
 * Created by sasha on 6/7/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "../board/IBoard";

export interface IProjectAttributes {
    _id?: number;
    name?: string;
    creator: IUserInstance;
    board: IBoardInstance;
    columns: [ICol]
}

export interface IProjectInstance  extends Instance<IProjectAttributes>, IProjectAttributes {
    dataValues: IProjectAttributes
}
