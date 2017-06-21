/**
 * Created by sasha on 6/20/17.
 */
export default function(sequelize, DataTypes) {
    const Board = sequelize.define('Project', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            validate:{
                isLength: {min:0, max: 50}
            }
        },
        info: DataTypes.STRING,
        active: DataTypes.BOOLEAN,

    },{
        classMethods:{
            associate: (models) => {
                Board.belongsTo(models.Project, {foreignKey: 'board'});
                Board.hasMany(models.ProjectColumn, {foreignKey:'board', as: 'columns'});
            }
        }
    });
    return Board;
}