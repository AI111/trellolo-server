import {ISocket} from "../../models/IExpress";
import {RoomEvents, RoomUserEvents} from "../../models/message/IMessage";
import {db} from "../../sqldb/index";
import {checkRoomAccessRights} from "./message.helpers";

export class MessageService {
    constructor(private room: SocketIO.Namespace) {
        this.room.on("connection", async (socket: ISocket) => {
            this.joinToMainRoom(socket, socket.decoded_token._id);
            this.setListeners(socket);
            // await this.onConnect(socket);
            socket.on("disconnect", () => this.onDisconnect(socket));
        });
    }

    public sendMessageToRoom(roomId: number, method: string, message: any): boolean {
        const roomName = `room:${roomId}`;
        if (!this.room.adapter.rooms[roomName]) return false;
        return this.room.to(roomName).emit(method, message);
    }
    public getConnectedUsersId(roomId: number): Set<number> {
        const socketRoom = this.room.adapter.rooms[`room:${roomId}`];
        return new Set(Object.keys((socketRoom && socketRoom.sockets) || {})
            .map((id) => (this.room.connected[id] as ISocket).decoded_token._id));
    }
    private async onConnect(socket: ISocket) {
        this.joinToMainRoom(socket, socket.decoded_token._id);
        const rooms = await  db.BoardToUser.findAll({
            where: {
                userId: socket.decoded_token._id,
            },
            raw: true,
        });
        rooms.forEach((room) => this.sendMessageToRoom(room._id, RoomEvents.USER_JOIN, socket.decoded_token));
    }
    private onDisconnect(socket: ISocket) {
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
