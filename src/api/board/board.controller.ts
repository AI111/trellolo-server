import {Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {IBoardAttributes, IBoardInstance} from "../../models/board/IBoard";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb/index";
import {checkProjectAccessRights} from "../project/project.helpers";
import {setBoardUsers} from "./board.helpers";

/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Sequelize.Model<IBoardInstance, IBoardAttributes>> {
    constructor() {
        super(db.Board);
    }
    public createValidator = Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        description: Joi.string().min(4).max(200).optional(),
        projectId: Joi.number().integer().required(),
    });
    // public myProjects = (req: Request, res: Response) => {
    //    return db.Team.findAll({
    //        where:{
    //            userId: req.user._id
    //        },
    //         include:[
    //                 {model: db.Project, as: 'project'}
    //             ]
    //    })
    //        .then(teams => teams.map(t => t.project))
    //        .then(this.handleEntityNotFound(res))
    //        .then(this.respondWithResult(res))
    //        .catch(this.handleError(res))
    // };
    // addUsersToBoard()
    public create = (req: Request, res: Response) => {
         return this.entity.create(req.body)
            .then(setBoardUsers(req.body.users))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public getColumns = (req: Request, res: Response) => {
        return db.ProjectColumn.findAll({
            where: {
                boardId: req.params.boardId,
            },
            raw: true,
            order: ["position"],
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new BoardController();
