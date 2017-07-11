/**
 * Created by sasha on 6/20/17.
 */
'use strict';

export default function(sequelize, DataTypes) {
    const Project =  sequelize.define('Project', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isLength: {min:0, max: 50},
                notEmpty: {
                    msg: 'Title is a required field'
                }
            }
        },
        icon: DataTypes.STRING,
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    });

    Project.associate = function(models)  {
        Project.belongsToMany(models.User,{
            through: {
                model: models.Team,
                unique: false,
            },
            foreignKey: "projectId",
            as:"users"
        })
    };
    return Project;
}
