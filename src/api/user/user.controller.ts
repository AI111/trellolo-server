"use strict";
import {NextFunction, Response} from "express";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {buildQueryByParams} from "../../common/query.builder";
import {config} from "../../config/environment";
import {Request} from "../../models/IExpress";
import {IUserAttributes, IUserInstance} from "../../models/user/IUser";
import {db} from "../../sqldb";

const debug = require("debug")("test.user.controller");

export class UserController extends BaseController<Sequelize.Model<IUserInstance, IUserAttributes>> {
    public createValidator = Joi.object().keys({
        name: Joi.string().optional(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        token: Joi.string().required(),
    });
    public findValidator = Joi.object().keys({
        email: Joi.string().email().required(),
    });
    constructor() {
        super(db.User);
    }
    /**
     * Authentication callback
     */
    public index = (req: Request, res: Response) => {
    return db.User.findAll({
            where: buildQueryByParams({}, req.query, ["email"]),
            attributes: [
                "_id",
                "email",
                "avatar",
            ],
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    /**
     * Creates a new user
     */
    public create = (req: Request, res: Response) => {
        req.body.avatar = (req.file && req.file.path) || req.filePath;
        const User = this.entity.build(req.body);
        User.setDataValue("provider", "local");
        User.setDataValue("role", "user");
        return User.save()
            .then((user) => {
                const token = jwt.sign({_id: user.getDataValue("_id")}, config.secrets.session, {
                    expiresIn: 60 * 60 * 5,
                });
                return {token, ...User.profile};
            })
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

    /**
     * Get a single user
     */
    public show = (req: Request, res: Response, next) => {
        const userId = req.params.id;

        return db.User.find({
            where: {
                _id: userId,
            },
        })
            .then((user) => {
                if (!user) {
                    return res.status(404).end();
                }
                res.json(user.profile);
            })
            .catch((err) => next(err));
    }

    /**
     * Change a users password
     */
    public changePassword = (req: Request, res: Response) => {
        const userId = req.user._id;
        const oldPass = String(req.body.oldPassword);
        const newPass = String(req.body.newPassword);

        return this.entity.find({
            where: {
                _id: userId,
            },
        })
            .then((user) => {
                if (user.authenticate(oldPass)) {
                    user.password = newPass;
                    return user.save()
                        .then(() => {
                            res.status(204).end();
                        })
                        .catch(this.validationError(res));
                } else {
                    return res.status(403).end();
                }
            });
    }

    /**
     * Get my info
     */
    public me = (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        return db.User.find({
            where: {
                _id: userId,
            },
            attributes: [
                "_id",
                "name",
                "email",
                "avatar",
                "role",
                "provider",
            ],
        })
            .then((user) => { // don't ever give out the password or salt
                if (!user) {
                    return res.status(401).end();
                }
                res.json(user);
            })
            .catch((err) => next(err));
    }
}
export const controller = new UserController();
