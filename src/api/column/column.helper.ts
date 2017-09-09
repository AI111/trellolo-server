
import {IColumnInstance} from "../../models/board/IColumn";
import {checkBoardAccessRights} from "../board/board.helpers";

export function checkColumnAccessRights(userId) {
    return (column: IColumnInstance) => {
        return checkBoardAccessRights(userId, column.boardId)
            .then(() => column);
    };
}
