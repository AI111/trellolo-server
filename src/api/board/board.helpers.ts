/**
 * Created by sasha on 7/8/17.
 */
import * as Joi from 'joi';
import {db} from "../../sqldb/index";
import * as Promise from "bluebird";
import {ServerError} from "../../models/IError";

export const boardValidator = Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(4).max(30).required(),
    token: Joi.string().required()
});
export function checkBoardUsers( projectId: number, users: [number] ){
    if(!users || !users.length) return Promise.resolve();
    return db.Team.findAll({
        where:{
            projectId: projectId,
            userId:{
                $in:users
            }
        }
    })
        .then(usersModels =>{
            if(users.length !== usersModels.length) return Promise.reject(new ServerError('This users not assigned to this project',403));
            return usersModels;
        })
}
export function setBoardUsers(users: [number]){
    return (board) => {
        console.log()
        if(!users || !users.length) return Promise.resolve(board);
        return db.BoardToUser.bulkCreate(users.map(userId => ({
            userId:userId,
            boardId:board._id
        })))
            .then(() => board)
    }
}