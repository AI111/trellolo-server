/**
 * Created by sasha on 6/20/17.
 */
export default function(sequelize, DataTypes) {
    const ProjectColumn = sequelize.define('ProjectColumn', {
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
        classMethods:{
            associate: (models) => {
                ProjectColumn.belongsTo(models.Board,{foreignKey: 'boardId', as: 'board' })
            }
        }
    });
    return ProjectColumn;
}