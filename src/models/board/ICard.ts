/**
 * Created by sasha on 6/21/17.
 */
import {Instance, Model, Transaction} from "sequelize";
import {Card} from "../../api/card/card.model";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "./IBoard";

export interface ICardAttributes{
    _id?: number;
    name?: string;
    title?: string;
    description?: string;
    creator?: IUserInstance;
    userId?: number;
    board?: IBoardInstance;
    boardId?: number;
    columnId?: number;
    position?: number;

}
export interface ICardInstance  extends Instance<ICardAttributes>, ICardAttributes {
    dataValues: ICardAttributes;
    getMaxCardPosition(boardId: number, columnId: number): Promise<number>;
    moveTo(columnId: number, position: number, t?: Transaction): Promise<Card>;
    updateCard(columnId: number, position?: number): Promise<Card>;
}
