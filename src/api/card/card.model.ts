
/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class Card extends Sequilize.Model{
    public static associate(models)  {
        console.log("Card.associate");
        Card.belongsTo(models.Board, {foreignKey: "boardId", as: "board" });
        Card.belongsTo(models.ProjectColumn, {foreignKey: "columnId", as: "column" });
    }
}
export default function(sequelize, DataTypes) {
    Card.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        userId: {
          type: DataTypes.INTEGER,
          references: {
              model: "Users",
              key: "_id",
          },
        },
        order: {
            type: DataTypes.INTEGER,
            notNull: true,
        },
    }, {
        sequelize,
    });
    return Card;
}
