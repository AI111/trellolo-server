/**
 * Created by sasha on 6/21/17.
 */


"use strict";
import * as Joi from "joi";
import {DataTypes, Transaction} from "sequelize";
import {ServerError} from "../../models/IError";
import {RoomAccessRights} from "../../models/room/IRoomToUser";
import {db} from "../../sqldb/index";
const Sequilize = require("sequelize");

export const createValidator =  Joi.object().keys({
    name: Joi.string().min(1).max(255).required(),
    projectId: Joi.number().integer().required(),
    users: Joi.array().unique().items(Joi.number().integer()).optional(),
});
export const retrieveValidator =  Joi.object().keys({
    messageId: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
    offset: Joi.number().integer().optional(),
});
export const updateValidator =  Joi.object().keys({
    name: Joi.string().min(1).max(255).optional(),
    projectId: Joi.number().integer().optional(),
    users: Joi.array().items(Joi.number().integer()).optional(),
});
export class Room extends Sequilize.Model {
    public static associate(models)  {
        Room.belongsToMany(models.User, {
            through: {
                model: models.UserToRoom,
                unique: false,
            },
            foreignKey: "roomId",
            as: "users",
        });
    }
    public async checkRoomUsers(users: [number]) {
        if (!users || !users.length) return this;
        const usersModels = await db.User.findAll({
            where: {
                _id: {
                    $in: users,
                },
            },
            include: [
                {
                    model: db.Project,
                    as: "projects",
                    attributes: [],
                    where: {
                        _id: this.projectId,
                    },
                },
            ],
        });
        if (users.length !== usersModels.length) throw new ServerError("This users not assigned to this project", 403);
        return usersModels;
    }
    public async setRoomUsers(users: number[] = [] as number[], tr?: Transaction) {
        if (!users.includes(this.creatorId))users.push(this.creatorId);
        await db.UserToRoom.bulkCreate(users.map((userId) => ({
                userId,
                roomId: this._id,
                accessRights: (userId === this.userId ? "creator" : "user") as RoomAccessRights ,
            })),
            {
                transaction: tr,
            });
        return this;
    }
}
export default function(sequelize, types: DataTypes) {
    Room.init({
        _id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: types.STRING,
        },
        creatorId: {
            type: types.INTEGER,
            references: {
                model: "Users",
                key: "_id",
            },
            onDelete: "cascade",
        },
        projectId: {
            type: types.INTEGER,
            references: {
                model: "Projects",
                key: "_id",
            },
            onDelete: "cascade",
        },
    }, {
        sequelize,
        timestamps: false,
    });
    return Room;
}
