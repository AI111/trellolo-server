import * as Promise from "bluebird";
import {NextFunction, Response} from "express";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {ServerError} from "../../models/IError";
import {Request} from "../../models/IExpress";
import {IMessageAttributes, IMessageInstance, RoomEvents} from "../../models/message/IMessage";
import {db} from "../../sqldb/index";
import {notifyRoomEvent} from "./message.helpers";
const debug = require("debug")("test.room.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class MessageController extends BaseController<Sequelize.Model<IMessageInstance, IMessageAttributes>> {
    constructor() {
        super(db.Message);
    }
    public create = (req: Request, res: Response, next: NextFunction) => {
        const message = this.entity.build(req.body);
        message.setDataValue("userId", req.user._id);
        return message.save()
            .then(notifyRoomEvent(RoomEvents.ADD_MESSAGE))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public path = (req: Request, res: Response, next: NextFunction) => {
        if (req.body._id) Reflect.deleteProperty(req.body, "_id");
        return this.entity.findById(req.params.id)
            .then(this.handleEntityNotFound(res))
            .then((message) => {
                if (message.creatorId !== req.user._id) throw new ServerError("You not have access to edit this massage", 403);
                return message;
            })
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new MessageController();
