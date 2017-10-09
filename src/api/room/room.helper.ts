import {ScocketServiceInstance} from "../../common/socket.service";

export function checkUsersOnline(){
    return (room) => {
        const onlineUsers = ScocketServiceInstance.room.getConnectedUsersId(room._id);
        room.users.forEach((user) => {
            user.UserToRoom.online = onlineUsers.has(user._id);
        });
        return room;
    };
}
