/**
 * Created by sasha on 6/21/17.
 */
"use strict";
const Sequilize = require("sequelize");

export class Invite extends Sequilize.Model {
    public static associate(models)  {
        console.log("Invite.associate");
    }
}
export default function(sequelize, DataTypes) {
    Invite.init({
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userFromId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "_id",
            },
            onDelete: "cascade",
        },
        userToId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "_id",
            },
            onDelete: "cascade",
        },
        projectId: {
          type: DataTypes.INTEGER,
          references: {
              model: "Projects",
              key: "_id",
          },
            onDelete: "cascade",
        },
        message: {
            type: DataTypes.STRING,
            isLength: {min: 2, max: 500},
        },
    }, {
        sequelize,
    });
    return Invite;
}
