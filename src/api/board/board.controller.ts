import {NextFunction, Response} from "express";
import * as Joi from "joi";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {IBoardAttributes, IBoardInstance} from "../../models/board/IBoard";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb/index";
import {checkProjectAccessRights} from "../project/project.helpers";
import {setBoardUsers} from "./board.helpers";

/**
 * Created by sasha on 6/22/17.
 */
export class BoardController extends BaseController<Sequelize.Model<IBoardInstance, IBoardAttributes>> {
    public createValidator = Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        description: Joi.string().min(4).max(200).optional(),
        projectId: Joi.number().integer().required(),
    });

    constructor() {
        super(db.Board);
    }
    public show = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.findOne({
            where: {
                _id: req.params.id,
            },
            include: [
                {
                    model: db.BoardColumn,
                    as: "columns",
                    include: [
                        {
                            model: db.Card,
                            as: "cards",
                        } ,
                    ],
                },
            ],
            order:  [
                [{model: db.BoardColumn, as: "columns"}, "position"],
                [{model: db.BoardColumn, as: "columns"}, {model: db.Card, as: "cards"}, "position"],
            ],
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public create = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.create(req.body)
            .then(setBoardUsers(req.user._id, req.body.users))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public getColumns = (req: Request, res: Response, next: NextFunction) => {
        return db.BoardColumn.findAll({
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
}
export const controller = new BoardController();
