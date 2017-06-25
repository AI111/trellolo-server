import {BaseController} from "../../common/base.controller";
import {Model, SequelizeStaticAndInstance} from "sequelize";
import {IBoardAttributes, IBoardInstance} from "../../models/board/IBoard";
import {db} from "../../sqldb/index";
import {Request, Response} from "express";
/**
 * Created by sasha on 6/22/17.
 */

export class ProjectController extends BaseController<Model<IBoardInstance, IBoardAttributes>> {
    constructor() {
        super(db.Board);
    }

    public show = (req: Request, res: Response) => {
        return db.User.findOne({
            where: {
                _id: req.user._id
            },
            include: [
                {model: db.Project, as: 'projects'}
            ]
        })
            .then(user => user.projects)
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res))
    };

    public create = (req: Request, res: Response) => {
        console.log('create');
        if(req.file)req.body.icon = req.file.path;
        return db.Project.create(req.body)
            .then(project => db.Team.create({
                user: req.user._id,
                project: project._id,
                accessRights: 'creator'
            }).then(t => project))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res))
    }
}
export const controller = new ProjectController();
