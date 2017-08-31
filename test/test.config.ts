/**
 * Created by sasha on 6/25/17.
 */
import {Response} from "express";
import {func} from "joi";
import {spy, stub} from "sinon";
import * as io from "socket.io-client";

// import {Promise} from 'sequelize'
import {SuperTest, Test} from "supertest";
import {Config} from "../src/config/environment";
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
export function getSocketConnection(jwt: string, boardId: number): Promise<SocketIOClient.Socket> {
    const socket = io.connect(`http://localhost:3000/boards`, {
        path: "/sockets",
        query: `token=${jwt}`,
    });
    return new Promise((resolve: (socket: any) => any, reject: (socket: any) => any) => {
        console.log("EMMIT");
        socket.emit("join_board", boardId, (status: number, mess: string) => {
            if (status === 200) return resolve(socket);
            return reject(socket);
        });
    });
}
