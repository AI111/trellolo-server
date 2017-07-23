/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class Board extends Sequilize.Model{
    static associate (models)  {
        Board.belongsTo(models.Project,{
            foreignKey: "projectId",
            as:"boards"
        });
        Board.belongsToMany(models.User,{
            through:{
                model: models.BoardToUser,
                unique: false,
            },
            foreignKey: "boardId",
            as:"users"
        })
    }
}
export default function(sequelize, DataTypes) {
    Board.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                isLength: {min:2, max: 50},
                notEmpty: {
                    msg: 'Title is a required field'
                },
            }
        },
        projectId:{
            type: DataTypes.INTEGER,
            references: {
                modal: 'Project',
                key: '_id',
            },
        },
        description: {
            type: DataTypes.STRING
        },
        info: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
    },{
        sequelize
    });

    return Board;
}