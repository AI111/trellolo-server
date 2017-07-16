"use strict";
import {captureServiceInstance} from "../../common/captcha.service";
import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {Config as config} from "../../config/environment";
import {IUserAttributes, IUserInstance} from "../../models/user/IUser";
import {db} from "../../sqldb";
import * as Joi from 'joi';
export class UserController extends BaseController<Sequelize.Model<IUserInstance, IUserAttributes>> {
    constructor() {
        super(db.User);
    }

    public index = (req: Request, res: Response) => {
        return db.User.findAll({
            attributes: [
                "_id",
                "name",
                "email",
                "role",
                "provider",
            ],
        })
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    };
    public createValidator = Joi.object().keys({
        name: Joi.string().optional(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        token: Joi.string().required()
    });
    /**
     * Creates a new user
     */
    public create = (req: Request, res: Response) => {
        let User = this.entity.build(req.body);
        if (req.file) User.setDataValue("avatar", req.file.path);
        User.setDataValue("provider", "local");
        User.setDataValue("role", "user");
        return User.save()
            .then((user) => {
                const token = jwt.sign({_id: user.getDataValue('_id')}, config.secrets.session, {
                    expiresIn: 60 * 60 * 5,
                });
                return {token, ... User.profile};
            })
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    };

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
    };

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
    };

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
    };

    /**
     * Authentication callback
     */
    public authCallback(req: Request, res: Response) {
        res.redirect("/");
    }

}
export const controller = new UserController();
