
/**
 * Created by sasha on 6/20/17.
 */
export default function(sequelize, DataTypes) {
    const BoardToUser = sequelize.define('BoardToUser', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            modal: 'User',
            key: '_id',
            onDelete: 'cascade',
            unique: 'compositeIndex'
        },
        role: {
            type: DataTypes.STRING
        },
        boardId: {
            type: DataTypes.INTEGER,
            modal: 'Board',
            key: '_id',
            onDelete: 'cascade',
            unique: 'compositeIndex'
        },
    });
    BoardToUser.associate = function(models) {

    };
    return BoardToUser;
}