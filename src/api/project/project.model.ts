/**
 * Created by sasha on 6/20/17.
 */
"use strict";
const Sequilize = require("sequelize");

export class Project extends Sequilize.Model{
    public static associate(models)  {
        console.log("Project.associate");
        Project.belongsToMany(models.User, {
            through: {
                model: models.Team,
                unique: false,
            },
            foreignKey: "projectId",
            as: "users",
        });
    }
}
export default function(sequelize, DataTypes) {
    Project.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLength: {min: 0, max: 50},
                notEmpty: {
                    msg: "Title is a required field",
                },
            },
        },
        icon: DataTypes.STRING,
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
    }, {
        sequelize,
    });
    return Project;
}
