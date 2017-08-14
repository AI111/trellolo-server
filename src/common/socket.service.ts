import * as http from "http";
import * as SocketIO from "socket.io";
import * as  redis from "socket.io-redis";
import * as socketioJwt from "socketio-jwt";
import {checkBoardAccessRights} from "../api/board/board.helpers";
import {Config} from "../config/environment";
import {ISocket} from "../models/IExpress";
export class SocketService{
    private server: http.Server;
    private io: SocketIO.Server;
    private boards: SocketIO.Namespace;
    constructor() {

    }
    public init(server: http.Server) {
        this.io = SocketIO(server);
        this.io.use(socketioJwt.authorize({
            secret: Config.secrets,
            handshake: true,
        }));
        this.io.adapter(redis({ host: "localhost", port: 6379 }));
    }
    private startListener(io: SocketIO.Server): void {
        this.boards = this.io.of("boards");
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

    public broadcastToRoom(method: string, message: object, room: string): void{
        throw this.boards.to(room).emit(method, message);
    }

}
