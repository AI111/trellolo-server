import {Instance} from "sequelize";
import {IBoardAttributes} from "../board/IBoard";
import {IUserAttributes} from "../user/IUser";

export interface IActivityMessageAttributes {
    _id?: number;
    message?: string;
}

export interface IActivityMessageInstance  extends Instance<IActivityMessageAttributes>, IActivityMessageAttributes {
    dataValues: IActivityMessageAttributes;
    associate(models);
}
