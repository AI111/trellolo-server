import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {db} from "../../sqldb/index";
import {ICardAttributes, ICardInstance} from "../../models/board/ICard";
import {Request, Response} from "express";

/**
 * Created by sasha on 6/22/17.
 */
export class CardController extends BaseController<Sequelize.Model<ICardInstance, ICardAttributes>> {
    public createValidator = Joi.object().keys({
        title: Joi.string().min(4).max(50).required(),
        description: Joi.string().min(4).max(1000).optional(),
        boardId: Joi.number().integer().required(),
        columnId: Joi.number().integer().required(),
    });
    public updateValidator = Joi.object().keys({
        _id: Joi.number().integer().required(),
        boardId: Joi.number().integer().required(),
        columnId: Joi.number().integer().required(),
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
    // public patch = (req: Request, res: Response) => {
    //
    // }
}
export const controller = new CardController();
