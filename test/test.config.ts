/**
 * Created by sasha on 6/25/17.
 */
import {spy,stub} from "sinon"
import {Response} from "express";
import {db} from "../src/sqldb/index";
import {func} from "joi";
// import {Promise} from 'sequelize'
import {SuperTest, Test} from "supertest";

export const config = {
    projectName:'TEST PROJECT name 777',
    testEmail: 'test_email@trellolo.com',
    icon:"./test/assets/test.icon.jpeg"
};
export const req: any ={
    body:{
        user:{
            _id:777,
            role:'user'
        },
    }


};
export var res: any = {
    status:stub(),
    sendStatus:spy(),
    send:stub(),
    json:stub(),
    end:spy()
}
export function createTestProjectUser() {
    // let data ={
    //
    // }
    return db.User.bulkCreate([
        {
            _id:1,
            name: 'Fake User',
            email: 'test@example.com',
            password: 'password'
        },
        {
            _id: 2,
            name: 'Fake User 2',
            email: 'test2@example.com',
            password: 'password'
        }
    ])
        .then(()=>db.Project.bulkCreate([
            {
                _id:1,
                title:"title 1",
                description: "description 1"
            },
            {
                _id:2,
                title:"title 2",
                description: "description 2"
            }
        ]))
        .then(() => db.Team.bulkCreate([
            {
                _id:1,
                userId:1,
                projectId:1,
                accessRights:'creator'
            },
            {
                _id:2,
                userId:2,
                projectId:2,
                accessRights:'admin'
            }
        ]))
        .then(() => db.Board.bulkCreate([
            {
                projectId:1,
                name:'board 1',
                description: 'description 1'
            },
            {
                projectId:2,
                name:'board 2',
                description: 'description 2'
            }
        ]))
        .then(() => db.BoardToUser.bulkCreate([
            {
                userId:1,
                boardId:1
            },
            {
                userId:1,
                boardId:2
            }
        ]))
}
export function cleadDBData(){
    return db.Team.destroy({where: {}})
        .then(() => db.Project.destroy({where: {}}))
        .then(() => db.User.destroy({where: {}}))
        .then(() => db.Board.destroy({where: {}}))
        .then(() => db.BoardToUser.destroy({where: {}}))
}
export function getToken(agent: SuperTest<Test>, email: string, password: string): Promise<string>{
    return new Promise((resolve, reject) => {
        agent
        .post('/auth/local')
            .send({
                email,
                password
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                const token:string = res.body.token;
                console.log(token);
                if(!token) return reject(err);
                return resolve(token);
            })
    })
}