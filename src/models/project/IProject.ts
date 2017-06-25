/**
 * Created by sasha on 6/7/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "../board/IBoard";
import {IColumnAttributes} from "../board/IColumn";
import {IDBInstance} from "../IDBInstance";

export interface IProjectAttributes extends IDBInstance{
    _id?: number;
    name?: string;
    description?: string;
    active?: boolean;
    icon?: string;
    creator?: IUserInstance;
    board?: IBoardInstance;
    columns?: [IColumnAttributes]
}

export interface IProjectInstance  extends Instance<IProjectAttributes>, IProjectAttributes {
    dataValues: IProjectAttributes
}
