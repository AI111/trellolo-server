import * as Promise from "bluebird";
import {NextFunction, Response} from "express";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {IActivityAttributes, IActivityInstance} from "../../models/activity/IActivity";
import {ServerError} from "../../models/IError";
import {Request} from "../../models/IExpress";
import {db} from "../../sqldb";
const debug = require("debug")("test.invite.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class ActivityController extends BaseController<Sequelize.Model<IActivityInstance, IActivityAttributes>> {
    constructor() {
        super(db.Activity);
    }
    public index = (req: Request, res: Response, next: NextFunction) => {
        return this.findWithPagination({
                where: {
                    projectId: req.projectId,
                },
            },
            req.query,
            ["userId", "table", "boardId", "messageId"])
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new ActivityController();
