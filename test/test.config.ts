/**
 * Created by sasha on 6/25/17.
 */
import {spy, stub} from "sinon";
import * as io from "socket.io-client";
import {SuperTest, Test} from "supertest";
import {RoomUserEvents} from "../src/models/message/IMessage";
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
        socket.emit("join_board", boardId, (status: number, mess: string) => {
            if (status === 200) return resolve(socket);
            return reject(socket);
        });
    });
}
export function getRoomConnection(jwt: string, roomId: number): Promise<SocketIOClient.Socket> {
    const socket = io.connect(`http://localhost:3000/rooms`, {
        path: "/sockets",
        query: `token=${jwt}`,
    });
    return new Promise((resolve: (socket: any) => any, reject: (socket: any) => any) => {
        socket.emit(RoomUserEvents.JOIN_ROOM, roomId, (status: number, mess: string) => {
            if (status === 200) return resolve(socket);
            return reject(socket);
        });
    });
}
