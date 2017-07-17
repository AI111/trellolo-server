
/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class BoardToUser extends Sequilize.Model{
    static associate(models)  {
        console.log('BoardToUser.associate')
    };
}
export default function(sequelize, DataTypes) {
    BoardToUser.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                modal: 'User',
                key: '_id'
            },
            constraint: false,
            unique: 'compositeIndex'
        },
        role: {
            type: DataTypes.STRING
        },
        boardId: {
            type: DataTypes.INTEGER,
            references: {
                modal: 'Board',
                key: '_id'
            },
            constraint: false,
            unique: 'compositeIndex'
        },
    },{
        sequelize
    });
    return BoardToUser;
}