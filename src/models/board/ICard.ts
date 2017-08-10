/**
 * Created by sasha on 6/21/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "./IBoard";

export interface ICardAttributes {
    _id?: number;
    name?: string;
    title?: string;
    creator?: IUserInstance;
    userId?: number;
    board?: IBoardInstance;
    boardId?: number;
    columnId?: number;
    position?: number;

}

export interface ICardInstance  extends Instance<ICardAttributes>, ICardAttributes {
    dataValues: ICardAttributes;
}
