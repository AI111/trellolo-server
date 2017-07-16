/**
 * Created by sasha on 6/7/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IColumnAttributes} from "./IColumn";

export interface IBoardToUserAttributes {
    _id?: number;
    name?: string;
    board?: IBoardToUserAttributes
    boardId?: number
    user?:IUserInstance
    userId?:number

}

export interface IBoardToUserInstance  extends Instance<IBoardToUserAttributes>, IBoardToUserAttributes {
    dataValues: IBoardToUserAttributes
}
