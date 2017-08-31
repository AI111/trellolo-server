import {Request} from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import * as  redis from "socket.io-redis";
import * as socketioJwt from "socketio-jwt";
import {checkBoardAccessRights} from "../api/board/board.helpers";
import {Config} from "../config/environment";
import {BoardEvent, eventsMap, IBoardEvent, IBoardItem} from "../models/activity/IBoardEvent";
import {ISocket} from "../models/IExpress";
import {number} from "joi";

export class SocketService{
    private server: http.Server;
    private io: SocketIO.Server;
    private boards: SocketIO.Namespace;
    private authorize = (socketioJwt.authorize({
        secret: Config.secrets.session,
        handshake: true,
    }))
    public init(server: http.Server) {
        this.io = SocketIO(server, {
            path: "/sockets",
        });
        this.io.adapter(redis({ host: "localhost", port: 6379 }));
        this.startListener(this.io);
    }

    public broadcastToRoom(method: string, message: object, room: string): boolean {
        return this.boards.to(room).emit(method, message);
    }

    public emmitEvent(req: Request, prevState?: IBoardItem, transform: (req: Request, item: IBoardItem, prevState?: IBoardItem) =>
        IBoardEvent = this.defualtTransformer) {
        return (entity) => {
            const boardId = req.headers.board || req.params.boardId || req.body.boardId || req.params.id;
            this.broadcastToRoom("notify", transform(req, entity, prevState), `board/${boardId}`);
            return entity;
        };
    }
    private defualtTransformer(req: Request, item: IBoardItem, prevState?: IBoardItem): IBoardEvent{
        const event = new BoardEvent();
        event.activityType = eventsMap[req.method];
        if (event.activityType === "CREATE" || event.activityType === "UPDATE")event.toState = item.dataValues;
        if (event.activityType === "DELETE" || event.activityType === "UPDATE")event.fromState = prevState || item._previousDataValues;
        event.modelName = item._modelOptions.name.singular;
        return event;
    }

    private startListener(io: SocketIO.Server): void {
        this.boards = this.io.of("/boards");
        this.boards.use(this.authorize);
        this.boards.on("connection", (socket: ISocket) => {
            //  socket.emit('ferret', 'tobi', function (data) {
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
export const ScocketServiceInstance = new SocketService();
