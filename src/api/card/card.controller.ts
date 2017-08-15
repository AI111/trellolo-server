import {Request, Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {ICardAttributes, ICardInstance} from "../../models/board/ICard";
import {db} from "../../sqldb/index";

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
        boardId: Joi.number().integer().required(),
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
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public patch = (req: Request, res: Response) => {
        if (req.body._id) {
        Reflect.deleteProperty(req.body, "_id");
    }
        return this.entity.findById(req.params.cardId)
            .then(this.handleEntityNotFound(res))
            .then((card) => card.moveTo(req.body.columnId, req.body.position))
            .then((card) => card.updateAttributes(req.body, {validate: true}))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new CardController();
