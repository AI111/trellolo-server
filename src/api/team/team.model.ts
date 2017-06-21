/**
 * Created by sasha on 6/21/17.
 */

export default function(sequelize, DataTypes) {
    return sequelize.define('team', {
        id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId:{
            type: DataTypes.INTEGER,
            modal: 'User',
            key:  '_id',
            onDelete: 'cascade'
        },
        teamName:{
            type: DataTypes.STRING
        },
        projectId: {
            type: DataTypes.INTEGER,
            modal: 'Project',
            key:  '_id',
            onDelete: 'cascade'
        },
        accessRights: {
            type:   DataTypes.ENUM,
            values: ['user', 'admin', 'creator'],
            defaultValue:'user'
        }
    });
}
