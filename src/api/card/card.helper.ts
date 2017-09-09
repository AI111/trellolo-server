
import {ICardInstance} from "../../models/board/ICard";
import {checkBoardAccessRights} from "../board/board.helpers";

export function checkCardAccessRights(userId){
    return (card: ICardInstance) => {
        return checkBoardAccessRights(userId, card.boardId)
            .then(() => card);
    };
};