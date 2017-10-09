/**
 * Created by sasha on 6/21/17.
 */
"use strict";
import {DataTypes} from "sequelize";
const Sequilize = require("sequelize");
export class UserToRoom extends Sequilize.Model {
    public isUserOnline = false;
    public static associate(models)  {
        console.log("Room-User.associate");
    }
    get test(){
        return "dsfsdfsdf";
    }

}

export default function(sequelize, types: DataTypes) {
    UserToRoom.init({
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
            constraint: false,
            unique: "compositeIndex",
        },
        roomId: {
            type: types.INTEGER,
            references: {
                model: "Rooms",
                key: "_id",
            },
            onDelete: "cascade",
            constraint: false,
            unique: "compositeIndex",
        },
        accessRights: {
            type: types.ENUM,
            values: ["user", "admin", "creator"],
            defaultValue: "user",
        },
        online: {
            type: types.VIRTUAL,
            get() {
                return this.isUserOnline;
            },
            set(val) {
                this.isUserOnline = val;
            },
        },
    }, {
        sequelize,
        timestamps: false,
    });
    return UserToRoom;
}
