
/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class BoardToUser extends Sequilize.Model{
    static associate(models)  {
        console.log("BoardToUser.associate");
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
                modal: "Users",
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
                modal: "Boards",
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
