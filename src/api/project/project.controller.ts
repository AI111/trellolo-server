import {BaseController} from "../../common/base.controller";
import {Model} from "sequelize";
import * as Promise from "bluebird";
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

    public update = (req: Request, res: Response) => {
        if(req.file)req.body.icon = req.file.path;
        return this.checkProjectAcessRights(req.user._id,req.params.id)
            .then(() => this.patch(req,res));
    };

    public create = (req: Request, res: Response) => {
        if(req.file)req.body.icon = req.file.path;
        return db.Project.create(req.body)
            .then(project => db.Team.create({
                user: req.user._id,
                project: project._id,
                accessRights: 'creator'
            }).then(t => project))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res))
    };
    private checkProjectAcessRights(userId: number, projectId: number): Promise<void>{
        return db.Team.findAll({
            where: {
                _id: projectId,
                user: userId,
                accessRights: {
                    $in: ['admin', 'creator']
                }
            }
        }).then(team => {
            if(!team.length) return Promise.reject('Yo not have access rights for editing this group');
            return team;
        })
    }
}
export const controller = new ProjectController();
