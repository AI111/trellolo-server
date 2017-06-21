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
        name: DataTypes.STRING,
        info: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        creator: {
            type: DataTypes.INTEGER,
            modal: 'User',
            key:  '_id',
            onDelete: 'cascade'
        },
        board: {
            type: DataTypes.INTEGER,
            modal: 'Board',
            key:  '_id',
            onDelete: 'cascade'
        },
    },{
        classMethods:{
            associate: (models) => {
                Project.belongsToMany(models.User,{
                    through:{
                        model: models.Team,
                        unique: false,
                    },
                    foreignKey: "projectId"
                })
            }
        }
    });
    return Project;
}
