
/**
 * Created by sasha on 6/20/17.
 */
export default function(sequelize, DataTypes) {
    const Card = sequelize.define('Card', {
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

    });
    Card.associate = function(models)  {
        Card.belongsTo(models.Board,{foreignKey: 'boardId', as: 'board' });
        Card.belongsTo(models.ProjectColumn,{foreignKey: 'columnId', as: 'column' });
    };
    return Card;
}