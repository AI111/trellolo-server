/**
 * Created by sasha on 6/21/17.
 */
"use strict";
const Sequilize = require("sequelize");

export class ActivityMessage extends Sequilize.Model {
    public static associate(models)  {
        console.log("Activity.associate");
    }
}
export default function(sequelize, DataTypes) {
    ActivityMessage.init({
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        message: {
            type: DataTypes.STRING,
            isLength: {min: 2, max: 500},
        },
    }, {
        sequelize,
    });
    return ActivityMessage;
}
