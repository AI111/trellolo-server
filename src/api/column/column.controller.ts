import {Response} from "express";
import * as Joi from "joi";
import {boolean} from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {IColumnAttributes, IColumnInstance} from "../../models/board/IColumn";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb/index";
import {checkBoardAccessRights} from "../board/board.helpers";

/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Sequelize.Model<IColumnInstance, IColumnAttributes>> {
    constructor() {
        super(db.ProjectColumn);
    }
    public createValidator = Joi.object().keys({
        title: Joi.string().min(2).max(30).required(),
        position: Joi.string().min(4).max(200).optional(),
    });
    public index = (req: Request, res: Response) => {
        return this.entity.findAll({
            where: {
                boardId: req.params.boardId,
            },
            raw: true,
            order: ["position"],
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public patch = (req: Request, res: Response) => {
        return this.entity.findById(req.params.columnId)
            .then(this.handleEntityNotFound(res))
            .then((col) => checkBoardAccessRights(req.user._id, col.boardId)
                .then(() => col))
            .then((column) => column.moveToPosition(req.body.position))
            .then((column) => column.updateAttributes(req.body, {validate: true}))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public create = (req: Request, res: Response) => {
        return this.entity.create(req.body, {validate: true})
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new BoardController();
