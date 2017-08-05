/**
 * Created by sasha on 6/20/17.
 */
const Sequilize = require("sequelize");

export class ProjectColumn extends Sequilize.Model {
    public static associate(models) {
        ProjectColumn.belongsTo(models.Board, {foreignKey: "boardId", as: "board"});
    }

    public getMaxBoardPosition(boardId: number): Promise<number> {
        return ProjectColumn.max("position", {
            where: {
                boardId,
            },
        });
    }

    public moveToPosition(position: number): Promise<this> {
        if (this.position === position || !position) return Sequilize.Promise.resolve(this);
        const inc: boolean = this.position > position;
        const between = [position, this.position].sort();
        return ProjectColumn.update({
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
        )
            .then(() => {
                this.position = position;
                return this;
            });
    }

}

export default function(sequelize, DataTypes) {
    ProjectColumn.init({
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
            // unique: "compositeIndex",
        },
        boardId: {
            type: DataTypes.INTEGER,
            references: {
                modal: "Boards",
                key: "_id",
            },
            onDelete: "cascade",
            // unique: "compositeIndex",
        },
    }, {
        sequelize,
        hooks: {
            beforeCreate(column, fields, fn) {
               return column.getMaxBoardPosition(column.boardId)
                    .then((position) => (column.position = position + 1));
            },
        },

    });
    return ProjectColumn;
}
