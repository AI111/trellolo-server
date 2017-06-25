import {BaseController} from "../../common/base.controller";
import {Model, SequelizeStaticAndInstance} from "sequelize";
import {IBoardAttributes, IBoardInstance} from "../../models/board/IBoard";
import {db} from "../../sqldb/index";
import {Request, Response} from "express";
/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Model<IBoardInstance, IBoardAttributes>> {
    constructor() {
        super(db.Board);
    }
    public myProjects = (req: Request, res: Response) => {
       return db.Team.findAll({
           where:{
               userId: req.user._id
           },
            include:[
                    {model: db.Project, as: 'project'}
                ]
       })
           .then(teams => teams.map(t => t.project))
           .then(this.handleEntityNotFound(res))
           .then(this.respondWithResult(res))
           .catch(this.handleError(res))
    }
}
export const controller = new BoardController();
