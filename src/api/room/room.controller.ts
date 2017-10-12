import * as Promise from "bluebird";
import {Response} from "express";
import * as Sequelize from "sequelize";
import {where} from "sequelize";
import {BaseController} from "../../common/base.controller";
import {ServerError} from "../../models/IError";
import {Request} from "../../models/IExpress";
import {IRoomAttributes, IRoomInstance} from "../../models/room/IRoom";
import {db} from "../../sqldb/index";
import {checkUsersOnline} from "./room.helper";
const debug = require("debug")("test.room.controller");

/**
 * Created by sasha on 6/22/17.
 */
export class RoomController extends BaseController<Sequelize.Model<IRoomInstance, IRoomAttributes>> {
    constructor() {
        super(db.Room);
    }
    public index = (req: Request, res: Response) => {
        return db.User.find({
            where: {
                _id: req.user._id,
            },
            include: [
                {
                    model: db.Room,
                    as: "rooms",
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
            .then((user) => user.rooms)
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
    public show = (req: Request, res: Response) => {
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
    public createRoom = async (req: Request, res: Response) => {
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
    public getRoomMessages = (req: Request, res: Response) => {
        return this.findWithPagination({
            where: {
                roomId: req.params.roomId,
            },
            order: [["createdAt", "DESC"]],
        }, req.query, [], db.Message)
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }
}
export const controller = new RoomController();
