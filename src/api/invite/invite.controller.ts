import * as Promise from "bluebird";
import {Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {ServerError} from "../../models/IError";
import {Request} from "../../models/IExpress";
import {IInviteAttributes, ITInviteInstance} from "../../models/invite/IInvite";
import {db} from "../../sqldb/index";
const debug = require("debug")("test.invite.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Sequelize.Model<ITInviteInstance, IInviteAttributes>> {
    public createValidator = Joi.object().keys({
        emails: Joi.array().items(Joi.string().email()).min(1).required(),
        projectId: Joi.number().integer().required(),
        message: Joi.string().max(500).optional(),
    });
    constructor() {
        super(db.Invite);
    }
    public create = (req: Request, res: Response) => {
        return db.User.findAll({
            where: {
                email: {
                 $in: [ ...new Set(req.body.emails)] as [string],
                },
            },
        })
            .then((users) => {
                if (!users.length) return Promise.reject(new ServerError("Users with this email not found", 404));
                return Promise.resolve(users);
            })
            .then((users) => this.entity.bulkCreate( users.map((user) => ({
                userFromId: req.user._id,
                userToId: user._id,
                projectId: req.body.projectId,
                message: req.body.message,
            }))))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public accept = (req: Request, res: Response) => {
        return this.entity.findById(req.params.id)
            .then( (invite) => {
                if (invite.userToId !== req.user._id) return Promise.reject(new ServerError("You not have rights to accept this invite", 403));
                return Promise.resolve(invite);
            })
            .then(this.handleEntityNotFound(res))
            .then((invite) => db.Team.create({
                    userId: invite.dataValues.userToId,
                    projectId: invite.dataValues.projectId,
                })
                    .then(() => invite.destroy()))
            .then(() => res.status(200).end())
            .catch(this.handleError(res));
    }
    public index = (req: Request, res: Response) => {
        return this.findWithPagination<ITInviteInstance, IInviteAttributes>({
            where: {
                userToId: req.user._id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new BoardController();
