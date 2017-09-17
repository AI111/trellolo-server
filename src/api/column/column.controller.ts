import {Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {logActivity, saveActivity} from "../../common/activity.service";
import {BaseController} from "../../common/base.controller";
import {ScocketServiceInstance as notify} from "../../common/socket.service";
import {IBoardItem} from "../../models/activity/IBoardEvent";
import {IColumnAttributes, IColumnInstance} from "../../models/board/IColumn";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb/index";
import {checkBoardAccessRights} from "../board/board.helpers";
import {ActivityMessagesEnum} from "../../models/activity/IActivity";
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
    public updateColumn = async (req: Request, res: Response) => {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, "_id");
        }
        try {
            const column = await this.entity.findById(req.params.columnId);
            await checkBoardAccessRights(req.user._id, column.boardId);
            this.handleEntityNotFoundSync(res, column);
            const t = await db.connection.transaction();
            const prevState = {...column.dataValues} as IBoardItem;
            await column.moveToPosition(req.body.position, t);
            await column.updateAttributes(req.body, {transaction: t});
            await saveActivity(req, ActivityMessagesEnum.UPDATE_COLUMN, column,prevState);
            notify.emmitEventSync(req, column, prevState);
            t.commit();
            this.respondWithResultSync(res, column);
        } catch (e) {
            this.handleErrorSync(res, e);
        }
    }

    public create = (req: Request, res: Response) => {
        return this.entity.create(req.body, {validate: true})
            .then(notify.emmitEvent(req))
            .then(logActivity(req, ActivityMessagesEnum.CREATE_COLUMN))
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
            .then(logActivity(req, ActivityMessagesEnum.DELETE_COLUMN))
            .then(notify.emmitEvent(req))
            .then(this.removeEntity(res))
            .catch(this.handleError(res));
    }
}
export const controller = new BoardController();
