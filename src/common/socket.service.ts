import * as http from "http";
import * as SocketIO from "socket.io";
import * as  redis from "socket.io-redis";
import * as socketioJwt from "socketio-jwt";
import {MessageService} from "../api/message/message.service";
import {config} from "../config/environment";
import {BoardEventService} from "./board.event.service";

export class SocketService {
    public board: BoardEventService;
    public room: MessageService;
    private io: SocketIO.Server;
    private authorize = socketioJwt.authorize({
        secret: config.secrets.session,
        handshake: true,
    });
    public init(server: http.Server) {
        this.io = SocketIO(server, {
            path: "/sockets",
        });
        this.io.adapter(redis({ host: "localhost", port: 6379 }));
        this.board = new BoardEventService(this.io.of("/boards").use(this.authorize));
        this.room = new MessageService(this.io.of("/rooms").use(this.authorize));
    }
}
export const ScocketServiceInstance = new SocketService();
