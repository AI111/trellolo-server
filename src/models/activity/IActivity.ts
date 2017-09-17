import {Instance} from "sequelize";
import {db} from "../../sqldb/index";
import {IBoardAttributes} from "../board/IBoard";
import {IUserAttributes} from "../user/IUser";
export enum ActivityMessagesEnum {
    CREATE_COLUMN= 1,
    UPDATE_COLUMN= 2,
    DELETE_COLUMN= 3,
    CREATE_CARD= 4,
    UPDATE_CARD= 5,
    DELETE_CARD= 6,
}
// export const activityModelsMap: Map<string, string> =
//     new Map([
//         ["CARD", db.Card.getTableName() + ""],
//         ["COLUMN", db.BoardColumn.getTableName() + ""],
//     ]);

export interface IActivityAttributes {
    _id?: number;
    userId?: number;
    user?: IUserAttributes;
    messageId?: number;
    message?: string;
    boardId?: number;
    board?: IBoardAttributes;
    table?: string;
    tableId?: number;
    diff?: object;
}

export interface IActivityInstance  extends Instance<IActivityAttributes>, IActivityAttributes {
    dataValues: IActivityAttributes;
    associate(models);
}
