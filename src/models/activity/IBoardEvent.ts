import {Instance} from "sequelize";
import {IColumnAttributes} from "../board/IColumn";

export interface IBoardItem {
    _id?: number;
    position?: number;
    dataValues?: any;
    _previousDataValues?: any;
    _modelOptions?: any;
}
export interface IBoardEvent {
    fromState?: IBoardItem;
    toState?: IBoardItem;
    activityType: string;
    modelName?: string;
}
export class BoardEvent implements IBoardEvent{
   public fromState?: IBoardItem;
   public toState?: IBoardItem;
   public activityType: string;
   public modelName?: string;
}
export const eventsMap = {
    POST: "CREATE",
    PUT: "UPDATE",
    DELETE: "DELETE",
};
