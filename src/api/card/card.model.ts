/**
 * Created by sasha on 6/20/17.
 */

import {number} from "joi";
import {Transaction} from "sequelize";

const Sequilize = require("sequelize");
const debug = require("debug")("test:card:model");

export class Card extends Sequilize.Model {
    public static associate(models)  {
        console.log("Card.associate");
        Card.belongsTo(models.Board, {foreignKey: "boardId", as: "board" });
        Card.belongsTo(models.BoardColumn, {foreignKey: "columnId", as: "column" });
    }
    public getMaxCardPosition(boardId: number, columnId: number): Promise<number> {
        return Card.max("position", {
            where: {
                boardId,
                columnId,
            },
        });
    }

    /**
     *
     * @param {number} coumnId
     * @param {number} position
     * @returns {Promise<Card>}
     */
    public moveTo(columnId: number, position: number): Promise<Card> {
        if ((this.position === position && columnId === this.columnId) || !position) return Sequilize.Promise.resolve(this);
        if (this.columnId === columnId) {
            return this.updateCard(columnId, position);
        } else {
            return this.updateCard(columnId)
                .then(() => this.updateCard(columnId, position));
        }
    }
    /**
     * change card position in column or remove from column
     * @param {number} columnId
     * @param {number} position if position undefined then card removed from  column
     * @returns {Promise<Card>}
     */
    public updateCard(columnId: number, position?: number): Promise<Card> {
        // if (typeof position !== "number"){
        //     t = position as Transaction;
        //     position = undefined;
        // }
        const sameCol = this.columnId === columnId;
        const inc: boolean = sameCol ? this.position > position : !(position === undefined) ;
        const between: number[] = [position, this.position].sort();
        const gt: number = (position === undefined) ? this.position : position;
        const operator: string = sameCol ? "$between" : "$gte";
        const pos: object = {};
        pos[operator] = sameCol ? between : gt;
        debug("%d / %d / %s / %O", this.columnId, columnId, sameCol, pos);
        return Card.update({
                position: Sequilize.literal(`position ${inc ? "+" : "-"}1`),
            },
            {
                where: {
                    boardId: this.boardId,
                    columnId: (position === undefined) ? this.columnId : columnId,
                    position: pos,
                },
            },
        )
            .then(() => {
                if (!(position === undefined)) this.position = position;
                return this;
            });
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
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        columnId: {
            type: DataTypes.INTEGER,
            references: {
                model: "BoardColumns",
                key: "_id",
            },
            onDelete: "CASCADE",
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
              model: "Users",
              key: "_id",
          },
            onDelete: "SET NULL",
        },
        boardId: {
          type: DataTypes.INTEGER,
          references: {
              model: "Boards",
              key: "_id",
          },
            onDelete: "CASCADE",
        },
        position: {
            type: DataTypes.INTEGER,
            notNull: true,
        },
    }, {
        sequelize,
        hooks: {
            beforeCreate(card, fields) {
                return card.getMaxCardPosition(card.boardId, card.columnId)
                    .then((position) => (card.position = (position || 0) + 1));
            },
        },
    });
    return Card;
}
