import {Request, Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {ScocketServiceInstance as notify} from "../../common/socket.service";
import {IBoardItem} from "../../models/activity/IBoardEvent";
import {ICardAttributes, ICardInstance} from "../../models/board/ICard";
import {db} from "../../sqldb/index";
import {checkBoardAccessRights} from "../board/board.helpers";
import {checkCardAccessRights} from "./card.helper";
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
            .then(notify.emmitEvent(req))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public patch = (req: Request, res: Response) => {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, "_id");
        }
        let prevState = null;
        return db.connection.transaction((t) =>
            this.entity.findById(req.params.cardId)
                .then(checkCardAccessRights(req.user._id))
                .then(this.handleEntityNotFound(res))
                .then((card) => {
                    prevState = {...card.dataValues} as IBoardItem;
                    return card; })
                .then((card) => card.moveTo(req.body.columnId, req.body.position, t))
                .then((card) => card.updateAttributes(req.body, {transaction: t}))
                .then((card) => notify.emmitEventSync(req, card, prevState)))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public updateCard = async (req: Request, res: Response) => {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, "_id");
        }
        try {
            let card = await this.entity.findById(req.params.cardId);
            await checkBoardAccessRights(req.user._id, card.dataValues.boardId);
            this.handleEntityNotFoundSync(res, card);
            const t = await db.connection.transaction();
            const prevState = {...card.dataValues} as IBoardItem;
            card = await card.moveTo(req.body.columnId, req.body.position, t);
            const ans = await card.updateAttributes(req.body, {transaction: t});
            notify.emmitEventSync(req, card, prevState);
            t.commit();
            this.respondWithResultSync(res, ans);
        } catch (e){
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
            .then(notify.emmitEvent(req))
            .then(this.removeEntity(res))
            .catch(this.handleError(res));
    }
}
export const controller = new CardController();
