/**
 * Created by sasha on 6/21/17.
 */
/**
 * Created by sasha on 6/7/17.
 */
import {Instance, Model} from "sequelize";
import {IUserInstance} from "../user/IUser";

export interface IBoardAttributes {
    _id?: number;
    name?: string;
    creator: IUserInstance;
    board: IBoardInstance
}

export interface IBoardInstance  extends Instance<IProjectInstance>, IProjectAttributes {
    dataValues: IProjectAttributes
}
