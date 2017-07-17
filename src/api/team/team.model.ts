/**
 * Created by sasha on 6/21/17.
 */
const Sequilize = require("sequelize");

export class Team extends Sequilize.Model{
    static associate(models)  {
        console.log('Team.associate')
    };
}
export default function(sequelize, DataTypes) {
    Team.init({
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                modal: 'User',
                key: '_id'
            },
            unique: 'compositeIndex'
        },
        teamName: {
            type: DataTypes.STRING
        },
        projectId: {
            type: DataTypes.INTEGER,
            references: {
                modal: 'Project',
                key: '_id',
            },
            unique: 'compositeIndex'
        },
        accessRights: {
            type: DataTypes.ENUM,
            values: ['user', 'admin', 'creator'],
            defaultValue: 'user'
        }
    },{
        sequelize
    });
    return Team;
}
