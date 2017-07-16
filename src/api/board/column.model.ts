/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class ProjectColumn extends Sequilize.Model{
    static associate(models)  {
        ProjectColumn.belongsTo(models.Board,{foreignKey: 'boardId', as: 'board' });
    };
}
export default function(sequelize, DataTypes) {
    ProjectColumn.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        info: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        order: DataTypes.INTEGER,
        boardId: {
            type: DataTypes.INTEGER,
            modal: 'Board',
            key:  '_id',
            onDelete: 'cascade'
        }
    },{
        sequelize
    });
    return ProjectColumn;
}