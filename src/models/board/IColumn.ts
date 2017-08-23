/**
 * Created by sasha on 6/21/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {ICardAttributes} from "./ICard";
import {IBoardInstance} from "./IBoard";
import {IBoardItem} from "../activity/IBoardEvent";

export interface IColumnAttributes{
    _id?: number;
    title?: string;
    board?: IBoardInstance;
    boardId?: number;
    position?: number;
    cards?: [ICardAttributes];
}

export interface IColumnInstance  extends Instance<IColumnAttributes>, IColumnAttributes {
    dataValues: IColumnAttributes;
    getMaxBoardPosition(boardId: number): Promise<number>;
    moveToPosition(position: number): Promise<void>;
}