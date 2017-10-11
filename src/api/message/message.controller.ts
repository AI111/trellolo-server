import * as Promise from "bluebird";
import {Response} from "express";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {Request} from "../../models/IExpress";
import {IMessageAttributes, IMessageInstance} from "../../models/message/IMessage";
import {db} from "../../sqldb/index";
const debug = require("debug")("test.room.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class MessageController extends BaseController<Sequelize.Model<IMessageInstance, IMessageAttributes>> {
    constructor() {
        super(db.Room);
    }
    public create = (req: Request, res: Response) => {
        const message = this.entity.build(req.body);
        message.setDataValue("userId", req.user._id);
        return message.save()
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new MessageController();
