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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isLength: {min:0, max: 50},
                notEmpty: {
                    msg: 'Name is a required field'
                }
            }
        },
        icon: DataTypes.STRING,
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    },{
        classMethods:{
            associate: (models) => {
                Project.belongsToMany(models.User,{
                    through: {
                        model: models.Team,
                        unique: false,
                    },
                    foreignKey: "project",
                    as:"users"
                })
            }
        }
    });
    return Project;
}
