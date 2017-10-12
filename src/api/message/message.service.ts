import {ISocket} from "../../models/IExpress";
import {RoomEvents, RoomUserEvents} from "../../models/message/IMessage";
import {db} from "../../sqldb/index";
import {checkRoomAccessRights} from "./message.helpers";

export class MessageService {
    constructor(private room: SocketIO.Namespace) {
        this.room.on("connection", (socket: ISocket) => {
            this.onConnect(socket);
            socket.on("disconnect", () => this.onDisconnect(socket));
            this.setListeners(socket);
        });
    }

    public sendMessageToRoom(roomId: number, method: string, message: any): boolean{
        return this.room.to(`room:${roomId}`).emit(method, message);
    }
    public getConnectedUsersId(roomId: number): Set<number> {
        const a = this.room;
        const socketRoom = this.room.adapter.rooms[`room:${roomId}`];
        return new Set(Object.keys((socketRoom && socketRoom.sockets) || {})
            .map((id) => (this.room.connected[id] as ISocket).decoded_token._id));
    }
    private onConnect(socket: ISocket) {
        this.joinToMainRoom(socket, socket.decoded_token._id);
        db.BoardToUser.findAll({
            where: {
                userId: socket.decoded_token._id,
            },
            raw: true,
        })
            .then((rooms) => rooms.forEach((room) =>
                this.sendMessageToRoom(room._id, RoomEvents.USER_JOIN, socket.decoded_token)));
    }
    private onDisconnect(socket: ISocket) {
        this.joinToMainRoom(socket, socket.decoded_token._id);
        db.BoardToUser.findAll({
            where: {
                userId: socket.decoded_token._id,
            },
            raw: true,
        })
            .then((rooms) => rooms.forEach((room) =>
                this.sendMessageToRoom(room._id, RoomEvents.USER_LEAVE, socket.decoded_token)));
    }
    private setListeners(socket: ISocket): void {
        socket.on(RoomUserEvents.JOIN_ROOM, this.joinToRoom(socket));
        socket.on(RoomUserEvents.LEAVE_ROOM, this.leaveRoom(socket));
    }
    private joinToRoom(socket: ISocket) {
        return (roomId: number, clb: (status: number, message: string) => void) => {
            checkRoomAccessRights(socket.decoded_token._id, roomId)
                .then(() => socket.join(`room:${roomId}`, (err) => {
                    if (err) return clb(500, err);
                    return clb(200, "Success");
                }))
                .catch((err) => clb(err.status, err.error));
        };
    }
    private leaveRoom(socket: ISocket) {
        return (clb: (status: number, message: string) => void) => {
            this.joinToMainRoom(socket, socket.decoded_token._id);
        };
    }

    private joinToMainRoom(socket: ISocket, userId: number) {
        socket.join(`user:${userId}`);
    }
}
