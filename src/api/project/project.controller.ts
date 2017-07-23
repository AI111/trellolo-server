import {BaseController} from "../../common/base.controller";
import * as Sequelize from "sequelize";
import * as Promise from "bluebird";
import {db} from "../../sqldb/index";
import {Request, Response} from "express";
import {checkProjectAccessRights} from "./project.helpers";
import {ProjectAccessRights} from "../../models/team/ITeam";
import {IProjectAttributes, IProjectInstance} from "../../models/project/IProject";
/**
 * Created by sasha on 6/22/17.
 */

export class ProjectController extends BaseController<Sequelize.Model<IProjectInstance, IProjectAttributes>> {

    constructor() {
        super(db.Project);
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
        if (req.file) req.body.icon = req.file.path;
        if (req.body._id) Reflect.deleteProperty(req.body, "_id");
        return this.entity.find({
                where: {
                    _id: req.params.projectId,
                }})
                .then(this.handleEntityNotFound(res))
                .then(project => project.updateAttributes(req.body,{validate:true}))
                .then(this.respondWithResult(res))
                .catch(this.handleError(res));
    };

    public create = (req: Request, res: Response) => {
        if (req.file) req.body.icon = req.file.path;
        return db.Project.create(req.body)
            .then(project => db.Team.create({
                userId: req.user._id,
                projectId: project._id,
                accessRights: 'creator'
            }).then(t => project))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res))
    };
    public latest = (req: Request, res: Response) =>{
        return db.User.findOne({
            where: {
                _id: req.user._id
            },
            include: [
                {
                    model: db.Project,
                    as: 'projects',
                    attributes:{
                        exclude:[
                            'Team'
                        ]
                    }
                }
            ],
            order:[
                [{model: db.Project, as: 'projects'}, 'updatedAt', 'DESC'],
            ]
        })
            .then(this.handleEntityNotFound(res))
            .then(user => user.projects)
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

}
export const controller = new ProjectController();
