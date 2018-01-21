import {NextFunction, Response} from "express";
import * as Sequelize from "sequelize";
import {AnyWhereOptions, Op} from "sequelize";
import {BaseController} from "../../common/base.controller";
import {buildQueryByParams} from "../../common/query.builder";
import {Request} from "../../models/IExpress";
import {IRoomAttributes, IRoomInstance} from "../../models/room/IRoom";
import {db} from "../../sqldb";
import {checkUsersOnline} from "./room.helper";

const debug = require("debug")("test.room.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class RoomController extends BaseController<Sequelize.Model<IRoomInstance, IRoomAttributes>> {

    public static async getMessageOffset(req: Request) {
        if (typeof req.query.messageId  === "undefined") return req.query.offset || 0;
        const offset = await db.Message.count({
            where: {
                roomId: req.params.roomId,
                _id: {
                    [Op.lt]:  req.query.messageId,
                },
            },
        });
        return offset; // Math.max(offset - req.query.limit || 50, 0);
    }
    constructor() {
        super(db.Room);
    }
    public index = (req: Request, res: Response, next: NextFunction) => {
        return db.User.find({
            where: {
                _id: req.user._id,
            },
            include: [
                {
                    model: db.Room,
                    as: "rooms",
                    where: buildQueryByParams({}, req.query, ["projectId"]) as AnyWhereOptions,
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            model: db.User,
                            as: "users",
                            through: {
                                attributes: [],
                            },
                            attributes: [
                                "_id", "email", "avatar", "name",
                            ],
                        },
                    ],
                },
            ],
        })
            .then(this.handleEntityNotFound(res))
            .then((user) => user && user.rooms)
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public show = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.findById(req.params.roomId, {
            include: [
                {
                    model: db.User,
                    as: "users",
                    attributes: [
                        "_id", "email", "avatar", "name",
                    ],
                },
            ],
        })
            .then(this.handleEntityNotFound(res))
            .then(checkUsersOnline())
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public createRoom = async (req: Request, res: Response, next: NextFunction) => {
        const tr = await db.connection.transaction();
        try {
            req.body.creatorId = req.user._id;
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

    public getRoomMessages = async (req: Request, res: Response, next: NextFunction) => {
        req.query.offset = await RoomController.getMessageOffset(req);
        return this.findWithPagination({
            where: {
                roomId: req.params.roomId,
            },
            raw: true,
            order: [["createdAt", "DESC"]],
        }, req.query, [], db.Message)
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

}
export const controller = new RoomController();
