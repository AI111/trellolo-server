/**
 * Created by sasha on 6/20/17.
 */
export default function(sequelize, DataTypes) {
    const Board = sequelize.define('Board', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            validate:{
                isLength: {min:0, max: 50},
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING
        },
        info: DataTypes.STRING,
        active: DataTypes.BOOLEAN,

    });
    Board.associate = function(models)  {
        Board.belongsTo(models.Project);
    };
    return Board;
}