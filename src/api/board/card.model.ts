
/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class Card extends Sequilize.Model{
    static associate(models)  {
        console.log('Card.associate')
        Card.belongsTo(models.Board,{foreignKey: 'boardId', as: 'board' });
        Card.belongsTo(models.ProjectColumn,{foreignKey: 'columnId', as: 'column' });
    };
}
export default function(sequelize, DataTypes) {
    Card.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        order: DataTypes.INTEGER,

    },{
        sequelize
    });
    return Card;
}