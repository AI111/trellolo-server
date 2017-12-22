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
    message: Joi.string().min(1).max(500).required(),
    roomId: Joi.number().integer().required(),
});
export const updateValidator =  Joi.object().keys({
    message: Joi.string().min(1).max(500).required(),
});
export class Message extends Sequilize.Model {
    public static associate(models)  {
    }
}
export default function(sequelize, types: DataTypes) {
    Message.init({
        _id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: types.INTEGER,
            references: {
                model: "Users",
                key: "_id",
            },
            onDelete: "cascade",
        },
        roomId: {
            type: types.INTEGER,
            references: {
                model: "Rooms",
                key: "_id",
            },
            onDelete: "cascade",
        },
        message: {
            type: types.STRING,
        },
    }, {
        sequelize,
    });
    return Message;
}
