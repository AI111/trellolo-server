import {Request} from "express";
import {checkBoardAccessRights} from "../api/board/board.helpers";
import {BoardEvent, eventsMap, IBoardEvent, IBoardItem} from "../models/activity/IBoardEvent";
import {ISocket} from "../models/IExpress";

export class BoardEventService {
    private boards: SocketIO.Namespace;
    constructor(io: SocketIO.Namespace) {
        this.boards = io;
        this.startListener(io);
    }
    public broadcastToRoom(method: string, message: object, room: string): boolean {
        return this.boards.to(room).emit(method, message);
    }
    public emmitEvent(req: Request, prevState?: IBoardItem,
                      transform: (req: Request, item: IBoardItem, prevState?: IBoardItem) =>
                          IBoardEvent = this.defualtTransformer) {
        return (entity) => {
            const boardId = req.headers.board || req.params.boardId || req.body.boardId || req.params.id;
            this.broadcastToRoom("notify", transform(req, entity, prevState), `board/${boardId}`);
            return entity;
        };
    }

    public emmitEventSync(req: Request,
                          item: IBoardItem,
                          prevState: IBoardItem = null,
                          transform: (req: Request, item: IBoardItem, prevState?: IBoardItem) =>
                              IBoardEvent = this.defualtTransformer ) {
        const boardId = req.headers.board || req.params.boardId
            || req.body.boardId || item.dataValues.boardId || req.params.id;
        this.broadcastToRoom("notify", transform(req, item, prevState), `board/${boardId}`);
        return item;
    }

    private defualtTransformer(req: Request,
                               item: IBoardItem,
                               prevState?: IBoardItem): IBoardEvent{
        const event = new BoardEvent();
        event.activityType = eventsMap[req.method];
        if (event.activityType === "CREATE"
            || event.activityType === "UPDATE")event.toState = item.dataValues;
        if (event.activityType === "DELETE"
            || event.activityType === "UPDATE")event.fromState = prevState || item._previousDataValues;
        event.modelName = item._modelOptions.name.singular;
        return event;
    }

    private startListener(io: SocketIO.Namespace): void {
        this.boards.on("connection", (socket: ISocket) => {
            socket.on("join_board", this.joinHandler(socket));
        });
    }
    /**
     *
     * @param {ISocket} socket
     * @returns {(boardId: number, clb: (status: number, message: string) => void) => any}
     */
    private joinHandler(socket: ISocket) {
        return (boardId: number, clb: (status: number, message: string) => void) => {
            checkBoardAccessRights(boardId, socket.decoded_token._id)
                .then(() => {
                    socket.join(`board/${1}`, (err) => {
                        if (err) return clb(500, err);
                        return clb(200, "Success");
                    });
                })
                .catch((err) => clb(500, err));
        };
    }

}
