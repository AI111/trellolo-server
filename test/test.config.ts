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
    console.log("CREATE");
    return db.User.bulkCreate([
        {
            _id: 1,
            name: "Fake User",
            email: "test@example.com",
            password: "password",
        },
        {
            _id: 2,
            name: "Fake User 2",
            email: "test2@example.com",
            password: "password",
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
            },{
                _id: 3,
                userId: 1,
                projectId: 3,
                accessRights: "creator",
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
        ]));

}
export function cleadDBData() {
    console.log("DELETE");
    return  db.User.destroy({where: {}})
        .then(() => db.Team.destroy({where: {}}))
        .then(() => db.Board.destroy({where: {}}))
        .then(() => db.Project.destroy({where: {}}))
        .then(() => db.BoardToUser.destroy({where: {}}));

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
                console.log(token);
                if (!token) return reject(err);
                return resolve(token);
            });
    });
}
export function CustomMatchers(chai) {
    chai.Assertion.addMethod("friendlyNewsPath", function() {
        const obj = this._obj;

        const expectedMessage = 'expected #{this} to seems like "/materia/:editorial/:slug"';
        const notExpectedMessage = 'expected #{this} to not seems like "/materia/:editorial/:slug"';

        const paths = obj.split("/");
        const assertion = paths.length === 3 && paths[0] === "" && paths[1] === "materia" && paths[2].match(/^.{1,}/);

        this.assert(assertion, expectedMessage, notExpectedMessage, "/materia/:editorial/:slug", obj);
    });
}
