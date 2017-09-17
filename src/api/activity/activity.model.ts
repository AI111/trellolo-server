/**
 * Created by sasha on 6/21/17.
 */
"use strict";
import {DataTypes} from "sequelize";
const Sequilize = require("sequelize");
export class Activity extends Sequilize.Model {
    public static associate(models)  {
        console.log("Activity.associate");
    }
}

export default function(sequelize, types: DataTypes) {
    Activity.init({
        _id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: types.INTEGER,
            references: {
                model: "ActivityMessages",
                key: "_id",
            },
            onDelete: "cascade",
        },
        messageId: {
            type: types.INTEGER,
            references: {
                model: "ActivityMessages",
                key: "_id",
            },
            onDelete: "cascade",
        },
        boardId: {
          type: types.INTEGER,
          references: {
              model: "Boards",
              key: "_id",
          },
            onDelete: "cascade",
        },
        table: {
            type: types.STRING,
        },
        tableId: {
            type: types.INTEGER,
        },
        diff: {
            type: types.JSON,
        },
    }, {
        sequelize,
    });
    return Activity;
}
