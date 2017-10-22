/**
 * Created by sasha on 6/25/17.
 */
import {spy, stub} from "sinon";
import * as io from "socket.io-client";
import {SuperTest, Test} from "supertest";
import {RoomUserEvents} from "../src/models/message/IMessage";
import {date} from "joi";
export const config = {
    projectName: "TEST PROJECT name 777",
    testEmail: "test_email@trellolo.com",
    icon: "./test/assets/test.icon.jpeg",
};
export const req: any = {
        user: {
            _id: 777,
            role: "user",
        },
};
export let res: any = {
    status: stub(),
    sendStatus: spy(),
    send: stub(),
    json: stub(),
    end: spy(),
};
export function timeoutPromise(time: number): Promise<void> {
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

/**
 * Create client socket stream
 * @param {string} jwt
 * @param {number} id
 * @param {string} event
 * @param {string} namespace
 * @returns {Promise<SocketIOClient.Socket>}
 */
export function getSocketConnection(jwt: string,
                                    id: number,
                                    event: string = "join_board",
                                    namespace: string = "boards"): Promise<SocketIOClient.Socket> {
    const socket = io.connect(`http://localhost:3000/${namespace}`, {
        path: "/sockets",
        query: `token=${jwt}`,
        forceNew: true,
    });
    return new Promise((resolve: (socket: any) => any, reject: (socket: any) => any) => {
        socket.emit(event, id, (status: number, mess: string) => {
            if (status === 200) return resolve(socket);
            return reject(socket);
        });
    });
}

export function checkAllSockets(sockets: SocketIOClient.Socket[], event: string,  clb: (data: any) => void) {
    return Promise.all(
        sockets.map((socket) => new Promise((resolve: () => void, reject: () => void) => {
            socket.on(event, (data) => {
                clb(data);
                resolve();
            });
        })
    ));
}
