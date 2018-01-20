import * as Promise from "bluebird";
import {db} from "../src/sqldb/index";
import {IMessageAttributes} from "../src/models/message/IMessage";
export function createTestActivates() {
    const tables = ["cards", "column", "boards"];
    return db.Activity.bulkCreate(
        [...Array(330).keys()].map((i) => {
            const id = ((i % 3) + 1);
            const boardId = ((i % 2) + 1);
            return {
                _id: i,
                userId: id,
                projectId: boardId,
                messageId: id,
                boardId,
                table: tables[id - 1],
                tableId: id,
            };
        }),
    );
}
export async function createTestProjectUser() {
    await createUsersData();
    await createProjectData();
    await creteBoardData();
    await createInviteData();
    await createActivityData();
    await createRoomData();
    await createTestMessages();
}

async function creteBoardData() {
    await db.Team.bulkCreate([
        {
            _id: 1,
            userId: 1,
            projectId: 1,
            accessRights: "creator",
        },
        {
            _id: 2,
            userId: 2,
            projectId: 2,
            accessRights: "admin",
        }, {
            _id: 3,
            userId: 1,
            projectId: 2,
            accessRights: "user",
        },
        {
            _id: 4,
            userId: 3,
            projectId: 1,
            accessRights: "user",
        },
        {
            _id: 5,
            userId: 2,
            projectId: 3,
            accessRights: "user",
        },
    ]);
    await db.Board.bulkCreate([
        {
            _id: 1,
            projectId: 1,
            name: "board 1",
            description: "description 1",
        },
        {   _id: 2,
            projectId: 2,
            name: "board 2",
            description: "description 2",
        },
    ]);
    await db.BoardToUser.bulkCreate([
        {
            _id: 1,
            userId: 1,
            boardId: 1,
        },
        {
            _id: 2,
            userId: 1,
            boardId: 2,
        },
    ]);
    await db.BoardColumn.bulkCreate([
        {
            _id: 1,
            boardId: 1,
            title: "Column 1",
            position: 1,
        },
        {
            _id: 2,
            title: "Title 2",
            boardId: 1,
            position: 2,
        },
        {
            _id: 3,
            title: "Title 3",
            boardId: 1,
            position: 4,
        },
        {
            _id: 4,
            title: "Title 4",
            boardId: 1,
            position: 3,
        },
        {
            _id: 5,
            title: "Title 5",
            boardId: 1,
            position: 5,
        },
    ]);
    return db.Card.bulkCreate([
        {
            _id: 1,
            description: "test title",
            position: 1,
            userId: 1,
            boardId: 1,
            columnId: 1,
        }, {
            _id: 2,
            description: "test title",
            position: 2,
            userId: 1,
            boardId: 1,
            columnId: 1,
        }, {
            _id: 3,
            description: "test title",
            position: 3,
            userId: 1,
            boardId: 1,
            columnId: 1,
        }, {
            _id: 4,
            description: "test title",
            position: 4,
            userId: 1,
            boardId: 1,
            columnId: 1,
        }, {
            _id: 5,
            description: "test title",
            position: 1,
            userId: 1,
            boardId: 1,
            columnId: 3,
        }, {
            _id: 6,
            description: "test title",
            position: 2,
            userId: 1,
            boardId: 1,
            columnId: 3,
        }, {
            _id: 7,
            description: "test title",
            position: 3,
            userId: 1,
            boardId: 1,
            columnId: 3,
        }, {
            _id: 8,
            description: "test title",
            position: 4,
            userId: 1,
            boardId: 1,
            columnId: 3,
        },
    ]);
}
function createInviteData() {
    return db.Invite.bulkCreate([
        {
            _id: 1,
            projectId: 1,
            userFromId: 1,
            userToId: 3,
            message: "team invite",
        }, {
            _id: 2,
            projectId: 1,
            userFromId: 1,
            userToId: 3,
            message: "team invite",
        }, {
            _id: 3,
            projectId: 2,
            userFromId: 2,
            userToId: 3,
            message: "team invite",
        },
    ]);
}
function createProjectData() {
    return db.Project.bulkCreate([
        {
            _id: 1,
            title: "title 1",
            description: "description 1",
        },
        {
            _id: 2,
            title: "title 2",
            description: "description 2",
        },
        {
            _id: 3,
            title: "title 3",
            description: "description 3",
        },
    ]);
}
function createActivityData() {
    return db.ActivityMessage.bulkCreate([
        {
            _id: 1,
            message: "Create new Column",
        }, {
            _id: 2,
            message: "Update Column",
        }, {
            _id: 3,
            message: "Delete Column",
        }, {
            _id: 4,
            message: "Create new Card",
        }, {
            _id: 5,
            message: "Update Card",
        }, {
            _id: 6,
            message: "Delete Card",
        },
    ]);
}
function createUsersData() {
    return db.User.bulkCreate([
        {
            _id: 1,
            name: "Fake User",
            email: "test@example.com",
            password: "password",
            avatar: "uploads/pop.jpg",
        },
        {
            _id: 2,
            name: "Fake User 2",
            email: "test2@example.com",
            password: "password",
            avatar: "uploads/pop.jpg",

        },
        {
            _id: 3,
            name: "Fake User 3",
            email: "test3@example.com",
            password: "password",
            avatar: "uploads/pop.jpg",
        },
    ]);
}
async function createRoomData() {
    await db.Room.bulkCreate([
        {
            _id: 1,
            projectId: 1,
            name: "room1",
            creatorId: 1,
        }, {
            _id: 2,
            projectId: 1,
            name: "room2",
            creatorId: 1,
        }, {
            _id: 3,
            projectId: 1,
            name: "room31",
            creatorId: 2,
        },
    ]);
    return db.UserToRoom.bulkCreate([
        {
            _id: 1,
            roomId: 1,
            userId: 1,
            accessRights: "user",
        }, {
            _id: 2,
            roomId: 1,
            userId: 3,
            accessRights: "user",
        }, {
            _id: 3,
            roomId: 2,
            userId: 1,
            accessRights: "user",
        }, {
            _id: 4,
            roomId: 3,
            userId: 2,
            accessRights: "user",
        }, {
            _id: 5,
            roomId: 3,
            userId: 3,
            accessRights: "user",
        },
    ]);
}

function createTestMessages(size: number = 100) {
    const timestamp = new  Date();
    const messages: IMessageAttributes[] = Array.from(Array(size).keys()).map((index) => ({
        _id: index,
        roomId: 1,
        message: `test message ${index}`,
        userId: (index % 2 === 0 ? 1 : 3),
        createdAt: (new Date(timestamp.getTime() + 5000 * index)),
        updatedAt: (new Date(timestamp.getTime() + 5000 * index)),
    }));
    return db.Message.bulkCreate(messages);
}
export async function cleadDBData() {
        await  db.User.destroy({where: {}});
        await db.Invite.destroy({where: {}});
        await db.Team.destroy({where: {}});
        await db.Board.destroy({where: {}});
        await db.Project.destroy({where: {}});
        // await db.Card.destroy({where: {}}))
        await db.BoardToUser.destroy({where: {}});
        await db.ActivityMessage.destroy({where: {}});
        await db.Activity.destroy({where: {}});
        await db.Room.destroy({where: {}});
        await db.Message.destroy({where: {}});

}
