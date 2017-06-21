/**
 * Created by sasha on 6/21/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {ICardAttributes} from "./ICard";
import {IBoardInstance} from "./IBoard";

export interface IColumnAttributes {
    _id?: number;
    name?: string;
    creator: IUserInstance;
    board: IBoardInstance
    order: number;
    cards: [ICardAttributes]
}

export interface IColumnInstance  extends Instance<IColumnAttributes>, IColumnAttributes {
    dataValues: IColumnAttributes;
}