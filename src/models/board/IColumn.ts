/**
 * Created by sasha on 6/21/17.
 */
import {Instance, Model, Transaction} from "sequelize";
import {IBoardInstance} from "./IBoard";
import {ICardAttributes} from "./ICard";

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
    moveToPosition(position: number, transaction?: Transaction): Promise<this>;
}
