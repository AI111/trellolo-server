import * as Promise from "bluebird";
import {Response} from "express";
import * as Sequelize from "sequelize";
import {BaseController} from "../../common/base.controller";
import {ServerError} from "../../models/IError";
import {Request} from "../../models/IExpress";
import {IRoomAttributes, IRoomInstance} from "../../models/room/IRoom";
import {db} from "../../sqldb/index";
const debug = require("debug")("test.room.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class ActivityController extends BaseController<Sequelize.Model<IRoomInstance, IRoomAttributes>> {
    constructor() {
        super(db.Room);
    }
    public createRoom = async (req: Request, res: Response) => {
        const tr = await db.connection.transaction();
        try {
            req.body.creator = req.user._id;
            const room = await db.Room.create(req.body, {transaction: tr});
            await room.checkRoomUsers(req.body.users);
            await room.setRoomUsers(req.body.users, tr);
            await tr.commit();
            this.respondWithResultSync(res, room);
        } catch (error) {
            await tr.rollback();
            this.handleErrorSync(res, error);
        }
    }
}
export const controller = new ActivityController();
