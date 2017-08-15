import {IColumnAttributes} from "../board/IColumn";
interface IBoardItem{
    _id: number;
    position: number;
}
interface IBoardEvent{
    fromState: IBoardItem;
    toState: IBoardItem;
}