import {Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {logActivity, saveActivity} from "../../common/activity.service";
import {BaseController} from "../../common/base.controller";
import {ScocketServiceInstance as notify} from "../../common/socket.service";
import {ActivityMessagesEnum as msg} from "../../models/activity/IActivity";
import {IBoardItem} from "../../models/activity/IBoardEvent";
import {ICardAttributes, ICardInstance} from "../../models/board/ICard";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb/index";
import {checkBoardAccessRights} from "../board/board.helpers";
/**
 * Created by sasha on 6/22/17.
 */
export class CardController extends BaseController<Sequelize.Model<ICardInstance, ICardAttributes>> {
    public createValidator = Joi.object().keys({
        description: Joi.string().min(4).max(1000).required(),
        boardId: Joi.number().integer().required(),
        columnId: Joi.number().integer().required(),
    });
    public updateValidator = Joi.object().keys({
        description: Joi.string().min(4).max(1000).optional(),
        columnId: Joi.number().integer().required(),
        position: Joi.number().integer().required(),
    });
    constructor() {
        super(db.Card);
    }
    public create = (req: Request, res: Response) => {
        const card = this.entity.build(req.body);
        card.setDataValue("userId", req.user._id);
        return card.save()
            .then(logActivity(req, msg.CREATE_CARD))
            .then(notify.emmitEvent(req))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public updateCard = async (req: Request, res: Response) => {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, "_id");
        }
        const t = await db.connection.transaction();
        try {
            let card = await this.entity.findById(req.params.cardId);
            await checkBoardAccessRights(req.user._id, card.dataValues.boardId);
            this.handleEntityNotFoundSync(res, card);
            const prevState = {...card.dataValues} as IBoardItem;
            card = await card.moveTo(req.body.columnId, req.body.position, t);
            await card.updateAttributes(req.body, {transaction: t});
            await saveActivity(req, msg.UPDATE_CARD, card, prevState);
            notify.emmitEventSync(req, card, prevState);
            await t.commit();
            this.respondWithResultSync(res, card);
        } catch (e) {
            await t.rollback();
            this.handleErrorSync(res, e);
        }
    }
    public destroy = (req: Request, res: Response) => {
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(logActivity(req, msg.DELETE_CARD))
            .then(notify.emmitEvent(req))
            .then(this.removeEntity(res))
            .catch(this.handleError(res));
    }
}
export const controller = new CardController();
