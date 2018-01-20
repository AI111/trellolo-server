import * as Joi from "joi";
import {Transaction} from "sequelize";
import {BoardToUser} from "../board/board-user.model";

const Sequilize = require("sequelize");
const debug = require("debug")("test:card:model");

export class CardToUser extends Sequilize.Model {
    public static associate(models)  {
        console.log("CardToUser.associate");
        CardToUser.belongsTo(models.Card, {foreignKey: "cardId", as: "board" });
        CardToUser.belongsTo(models.User, {foreignKey: "userId", as: "user" });

    }
}
export default function(sequelize, DataTypes) {
    CardToUser.init({
            _id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            description: DataTypes.STRING,
            active: DataTypes.BOOLEAN,
            cardId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Card",
                    key: "_id",
                },
                onDelete: "CASCADE",
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "_id",
                },
                onDelete: "SET NULL",
            },
            accessRights: {
                type: DataTypes.ENUM,
                values: ["user", "creator"],
                defaultValue: "user",
            },
        }, {
            sequelize,
        });
    return CardToUser;
}
