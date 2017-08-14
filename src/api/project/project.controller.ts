import * as Promise from "bluebird";
import {Response} from "express";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {buildQueryByParams} from "../../common/query.builder";
import {Request} from "../../models/IExpress";
import {IProjectAttributes, IProjectInstance} from "../../models/project/IProject";
import {db} from "../../sqldb/index";
import * as Joi from "joi";

const debug = require("debug")("test:project.controller");

/**
 * Created by sasha on 6/22/17.
 */

export class ProjectController extends BaseController<Sequelize.Model<IProjectInstance, IProjectAttributes>> {
    public createValidator = Joi.object().keys({
        title: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(4).max(1000).optional()
    });
    constructor() {
        super(db.Project);
    }
    public show = (req: Request, res: Response) => {
        return db.User.findOne({
            where: {
                _id: req.user._id,
            },
            include: [
                {
                    model: db.Project,
                    as: "projects",
                    include: [
                        {
                            model: db.User,
                            as: "users",
                            attributes: [
                                "email",
                                "name",
                                "avatar",
                                "_id",
                            ],
                        },
                    ],
                },
            ],

        })
            .then((user) => user && user.projects)
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

    public update = (req: Request, res: Response) => {
        if (req.file) req.body.icon = req.file.path;
        if (req.body._id) Reflect.deleteProperty(req.body, "_id");
        return this.entity.find({
            where: {
                _id: req.params.projectId,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then((project) => project.updateAttributes(req.body, {validate: true}))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

    public create = (req: Request, res: Response) => {
        req.body.icon = (req.file && req.file.path) || req.filePath;
        return db.Project.create(req.body, {validate: true})
            .then((project) => db.Team.create({
                accessRights: "creator",
                projectId: project._id,
                userId: req.user._id,
            }).then((t) => project))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public latest = (req: Request, res: Response) => {
        return db.Project.findOne({
            include: [
                {
                    model: db.Team,
                    // as: "users",
                    attributes: [],
                    where: {
                        userId: req.user._id,
                    },
                },
            ],
            order: [
                ["updatedAt", "DESC"],
            ],
            raw: true,
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public getBoards = (req: Request, res: Response) => {
        return db.User.findOne({
            where: {
                _id: req.user._id,
            },
            include: [
                {
                    model: db.Board,
                    as: "boards",
                    where: {
                        projectId: req.params.projectId,
                    },
                    include: [
                        {
                            model: db.User,
                            as: "users",
                            attributes: [
                                "email",
                                "name",
                                "avatar",
                                "_id",
                            ],
                        },
                    ],
                }],
        })
            .then((user) => user && user.boards)
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public getUsers = (req: Request, res: Response) => {
        return db.User.findAll({
            where: buildQueryByParams({}, req.query, [
                {type: "$like", name: "email", format: "%%%s%"},
            ]),
            attributes:[
                "email",
                "name",
                "avatar",
                "_id",
            ],
            include: [
                {
                    model: db.Project,
                    as: "projects",
                    attributes: [],
                    where: {
                        _id: req.params.projectId,
                    },
                },
            ],
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}

export const controller = new ProjectController();
