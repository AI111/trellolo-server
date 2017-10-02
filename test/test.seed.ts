import {db} from "../src/sqldb/index";

export function createTestActivitys(){
    return
}
export function createTestProjectUser() {
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
    ])
        .then(() => db.Project.bulkCreate([
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
        ]))
        .then(() => db.Team.bulkCreate([
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
        ]))
        .then(() => db.Board.bulkCreate([
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
        ]))
        .then(() => db.BoardToUser.bulkCreate([
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
        ]))
        .then(() => db.BoardColumn.bulkCreate([
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
        ]))
        .then(() => db.Card.bulkCreate([
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
        ]))
        .then(() => db.Invite.bulkCreate([
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
        ]))
        .then(() => db.ActivityMessage.bulkCreate([
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
        ]));

}
export function cleadDBData() {
    return  db.User.destroy({where: {}})
        .then(() => db.Invite.destroy({where: {}}))
        .then(() => db.Team.destroy({where: {}}))
        .then(() => db.Board.destroy({where: {}}))
        .then(() => db.Project.destroy({where: {}}))
        // .then(() => db.Card.destroy({where: {}}))
        .then(() => db.BoardToUser.destroy({where: {}}))
        .then(() => db.ActivityMessage.destroy({where: {}}));

}
