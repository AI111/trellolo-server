/**
 * Created by sasha on 6/20/17.
 */
import {Transaction} from "sequelize";

const Sequilize = require("sequelize");

export class BoardColumn extends Sequilize.Model {
    public static associate(models) {
        BoardColumn.belongsTo(models.Board, {foreignKey: "boardId", as: "board"});
        BoardColumn.hasMany(models.Card, {foreignKey: "columnId", as: "cards"});
    }

    public static getMaxBoardPosition(boardId: number): Promise<number> {
        return BoardColumn.max("position", {
            where: {
                boardId,
            },
        });
    }

    public moveToPosition(position: number, transaction?: Transaction): Promise<this> {
        if (this.position === position || !position) return Sequilize.Promise.resolve(this);
        const inc: boolean = this.position > position;
        const between = [position, this.position].sort();
        return BoardColumn.update({
                position: Sequilize.literal(`position ${inc ? "+" : "-"}1`),
            },
            {
                where: {
                    boardId: this.boardId,
                    position: {
                        $between: between,
                    },
                },
                order: ["position", "DESC"],
            },
            transaction,
        )
            .then(() => {
                this.position = position;
                return this;
            });
    }

}

export default function(sequelize, DataTypes) {
    BoardColumn.init({
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            isLength: {min: 2, max: 50},
            notEmpty: {
                msg: "Column title is required field",
            },
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
        },
        boardId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Boards",
                key: "_id",
            },
            onDelete: "cascade",
        },
    }, {
        sequelize,
        hooks: {
            beforeCreate(column, fields, fn) {
                return BoardColumn.getMaxBoardPosition(column.boardId)
                    .then((position) => (column.position = position + 1));
            },
        },
    });
    return BoardColumn;
}
