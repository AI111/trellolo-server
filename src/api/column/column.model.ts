/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class ProjectColumn extends Sequilize.Model {
    static associate(models) {
        ProjectColumn.belongsTo(models.Board, {foreignKey: 'boardId', as: 'board'});
    };

    getMaxBoardPosition(boardId: number): Promise<number> {
        return ProjectColumn.max('position', {
            where: {
                boardId
            }
        })
    }

    moveToPosition(position: number): Promise<this> {
        if (this.position === position || !position) return Sequilize.Promise.resolve(this);
        const inc: boolean = this.position > position;
        let between = [position, this.position].sort();
        return ProjectColumn.update({
                position: Sequilize.literal(`IF(_id=${this._id}, ${1000}, position ${inc?'+':'-'}1)`)
            },
            {
                where: {
                    boardId: this.boardId,
                    position: {
                        $between: between
                    }
                }
            }
        )
            .then(() => {
                this.position = position;
                return this;
            })
    }

}

export default function (sequelize, DataTypes) {
    ProjectColumn.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
          type: DataTypes.STRING,
            isLength: {min:2, max: 50},
            notEmpty:{
                msg: "Column title is required field"
            },
            allowNull: false
        },
        info: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        position: {
            type: DataTypes.INTEGER,
            // unique: 'compositeIndex'
        },
        boardId: {
            type: DataTypes.INTEGER,
            references: {
                modal: 'Board',
                key: '_id'
            },
            onDelete: 'cascade',
            // unique: 'compositeIndex'
        }
    }, {
        sequelize,
        hooks: {
            beforeCreate(column, fields, fn) {
               return column.getMaxBoardPosition(column.boardId)
                    .then(position => (column.position = position + 1))
            },
            beforeUpdate(user, fields, fn) {
                // if (user.changed('password')) return user.updatePassword();
                // return sequelize.Promise.resolve();
            },
            afterUpdate(column,fields){
                console.log('AFTERUPDATE',column);
            },
            afterBulkUpdate(column,fields){
                console.log('AFTERBULKUPDATE');
            }
        },

    });
    return ProjectColumn;
}