import * as Promise from "bluebird";
import {ServerError} from "../../models/IError";
import {RoomAccessRights} from "../../models/room/IRoomToUser";
import {db} from "../../sqldb";
import {IBoardToUserAttributes} from "../../models/board/IBoardToUser";
import {RoomEvents} from "../../models/message/IMessage";
import {ScocketServiceInstance as notify} from "../../common/socket.service";

/**
 * Created by sasha on 7/8/17.
 */
export function checkRoomAccessRights(userId: number,
                                      roomId: number,
                                      roles: [RoomAccessRights] = ["admin", "creator", "user"]):
Promise<IBoardToUserAttributes[]> {
    return db.UserToRoom.findAll({
        where: {
            roomId,
            userId,
            accessRights: {
                $in: roles,
            },
        },
        raw: true,
    }).then((team) => {
        if (!team.length) throw new ServerError("Yo not have access rights for editing this room", 403);
        return team;
    });
}
export function notifyRoomEvent(type: RoomEvents) {
    return (message) => {
        notify.room.sendMessageToRoom(message.roomId, type, message);
        return message;
    }
}