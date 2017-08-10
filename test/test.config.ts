/**
 * Created by sasha on 6/25/17.
 */
import {Response} from "express";
import {func} from "joi";
import {spy, stub} from "sinon";
// import {Promise} from 'sequelize'
import {SuperTest, Test} from "supertest";
import {db} from "../src/sqldb/index";

export const config = {
    projectName: "TEST PROJECT name 777",
    testEmail: "test_email@trellolo.com",
    icon: "./test/assets/test.icon.jpeg",
};
export const req: any = {
    body: {
        user: {
            _id: 777,
            role: "user",
        },
    },

};
export let res: any = {
    status: stub(),
    sendStatus: spy(),
    send: stub(),
    json: stub(),
    end: spy(),
};
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
        .then(() => db.ProjectColumn.bulkCreate([
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
                position: 3,
            },
            {
                _id: 4,
                title: "Title 4",
                boardId: 1,
                position: 4,
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
                title: "test title",
                position: 1,
                userId: 1,
                boardId: 1,
                columnId: 1,
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
        ]));

}
export function cleadDBData() {
    return  db.User.destroy({where: {}})
        .then(() => db.Invite.destroy({where: {}}))
        .then(() => db.Team.destroy({where: {}}))
        .then(() => db.Board.destroy({where: {}}))
        .then(() => db.Project.destroy({where: {}}))
        // .then(() => db.Card.destroy({where: {}}))
        .then(() => db.BoardToUser.destroy({where: {}}));

}
export function timeoutPromise(time: number): Promise<void>{
    return new Promise((resolve: () => void, reject: () => void) => {
        setTimeout(resolve, time);
    });
}
export function getToken(agent: SuperTest<Test>, email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        agent
            .post("/auth/local")
            .send({
                email,
                password,
            })
            .expect(200)
            .expect("Content-Type", /json/)
            .end((err, res) => {
                const token: string = res.body.token;
                if (!token) return reject(err);
                return resolve(token);
            });
    });
}
