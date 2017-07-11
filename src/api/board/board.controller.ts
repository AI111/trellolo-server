import {BaseController} from "../../common/base.controller";
import * as Sequelize from "sequelize";
import {IBoardAttributes, IBoardInstance} from "../../models/board/IBoard";
import {db} from "../../sqldb/index";
import {Response} from "express";
import {checkProjectAccessRights} from "../project/project.helpers";
import {Request} from "../../models/IExpress";
import {checkBoardUsers, setBoardUsers} from "./board.helpers";
/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Sequelize.Model<IBoardInstance, IBoardAttributes>> {
    constructor() {
        super(db.Board);
    }
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
        return checkProjectAccessRights(req.user._id, req.projectId)
            .then(checkBoardUsers(req.projectId, req.body.users))
            .then(() => req.body.projectId = req.projectId )
            .then(() =>this.entity.create(req.body))
            .then(setBoardUsers(req.body.users))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res))
    }
}
export const controller = new BoardController();
