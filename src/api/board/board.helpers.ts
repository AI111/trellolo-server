/**
 * Created by sasha on 7/8/17.
 */
import * as Promise from "bluebird";
import * as Joi from "joi";
import {BoardAccessRights} from "../../models/board/IBoardToUser";
import {ServerError} from "../../models/IError";
import {db} from "../../sqldb/index";
const debug = require("debug")("test.board.helper");

export const boardValidator = Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(4).max(30).required(),
    token: Joi.string().required(),
});
export function checkBoardUsers( projectId: number, users: [number] ){
    if (!users || !users.length) return Promise.resolve();
    return db.Team.findAll({
        where: {
            projectId,
            userId: {
                $in: users,
            },
        },
    })
        .then((usersModels) => {
            if (users.length !== usersModels.length) return Promise.reject(new ServerError("This users not assigned to this project", 403));
            return usersModels;
        });
}
export const  setBoardUsers = (creator: number, users: [number] = [] as [number]) => {
    return (board) => {
        users.push(creator);
        return db.BoardToUser.bulkCreate(users.map((userId) => ({
            userId,
            boardId: board._id,
            accessRights: (userId === creator ? "creator" : "user") as BoardAccessRights,
        })))
            .then(() => board);
    };
}
export function  checkBoardAccessRights(userId: number, boardId: number,
                                        roles: [BoardAccessRights] = ["user", "admin", "creator"]): Promise<void> {
    return db.BoardToUser.findAll({
        where: {
            boardId,
            userId,
            accessRights: {
                $in: roles,
            },
        },
    }).then((team) => {
        if (!team.length) return Promise.reject(new ServerError("Yo not have access rights for using this board", 403));
        return team;
    });
}
