/**
 * Created by sasha on 7/8/17.
 */
import * as Promise from "bluebird";
import * as Joi from "joi";
import {BoardAccessRights, IBoardToUserInstance} from "../../models/board/IBoardToUser";
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
            if (users.length !== usersModels.length) throw new ServerError("This users not assigned to this project", 403);
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
                                        roles: [BoardAccessRights] = ["user", "admin", "creator"]): Promise<IBoardToUserInstance> {
    return db.BoardToUser.findOne({
        where: {
            boardId,
            userId,
            accessRights: {
                $in: roles,
            },
        },
        include: [
            {
                model: db.Board,
                as: "board",
            },
        ],
    }).then((team) => {
        if (!team) throw new ServerError("Yo not have access rights for using this board", 403);
        return team;
    });
}
