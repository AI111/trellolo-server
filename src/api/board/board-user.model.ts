
/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class BoardToUser extends Sequilize.Model{
    static associate(models)  {
        console.log("BoardToUser.associate");
        BoardToUser.belongsTo(models.Board, {foreignKey: "boardId", as: "board" });
    }

}
export default function(sequelize, DataTypes) {
    BoardToUser.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "_id",
            },
            constraint: false,
            unique: "compositeIndex",
        },
        accessRights: {
            type: DataTypes.ENUM,
            values: ["user", "admin", "creator"],
            defaultValue: "user",
        },
        boardId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Boards",
                key: "_id",
            },
            constraint: false,
            unique: "compositeIndex",
        },
    }, {
        sequelize,
    });
    return BoardToUser;
}
