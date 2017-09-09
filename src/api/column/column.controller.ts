import {Response} from "express";
import * as Joi from "joi";
import {boolean} from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {IColumnAttributes, IColumnInstance} from "../../models/board/IColumn";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb/index";
import {checkBoardAccessRights} from "../board/board.helpers";
import {ScocketServiceInstance as notify} from "../../common/socket.service";
import {checkColumnAccessRights} from "./column.helper";

/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Sequelize.Model<IColumnInstance, IColumnAttributes>> {
    public createValidator = Joi.object().keys({
        title: Joi.string().min(2).max(30).required(),
        boardId: Joi.number().integer(),
    });
    public updateValidator = Joi.object().keys({
        title: Joi.string().min(2).max(30).optional(),
        position: Joi.number().integer().optional(),
    });
    constructor() {
        super(db.BoardColumn);
    }

    // public index
    public patch = (req: Request, res: Response) => {
        return this.entity.findById(req.params.columnId)
            .then(this.handleEntityNotFound(res))
            .then(checkColumnAccessRights(req.user._id))
            .then((column) => column.moveToPosition(req.body.position))
            .then((column) => column.updateAttributes(req.body, {validate: true}))
            .then(notify.emmitEvent(req))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public create = (req: Request, res: Response) => {
        return this.entity.create(req.body, {validate: true})
            .then(notify.emmitEvent(req))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public destroy = (req: Request, res: Response) => {
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(notify.emmitEvent(req))
            .then(this.removeEntity(res))
            .catch(this.handleError(res));
    }
}
export const controller = new BoardController();
