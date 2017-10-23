/**
 * Created by sasha on 7/12/17.
 */
import {expect, use} from "chai";
import {agent, Response, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import {RoomEvents, RoomUserEvents} from "../../../src/models/message/IMessage";
import {getSocketConnection, getToken, checkAllSockets} from "../../test.config";
import {cleadDBData, createTestProjectUser} from "../../test.seed";

const httpAgent: SuperTest<Test> = agent(app.default);
const debug = require("debug")("test:board:controller");

use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));
use(require("chai-arrays"));

describe("Message API:", function() {
    // before((done) => app.default.on("listening", () => done()));
    this.timeout(5000);
    describe("POST /api/messages", function() {
        let tokenValid: string;
        let userToken2: string;
        let socket: SocketIOClient.Socket;
        let socket2: SocketIOClient.Socket;
        before(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            userToken2 = await getToken(httpAgent, "test3@example.com", "password");
            socket = await getSocketConnection(tokenValid, 1, RoomUserEvents.JOIN_ROOM, "rooms");
            socket2 = await getSocketConnection(userToken2, 1, RoomUserEvents.JOIN_ROOM, "rooms");
        });
        after(() => {
            socket.close();
            socket2.close();
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated",async () => {
            const resp = await httpAgent
                .get("/api/messages");
            expect(resp.status).to.be.equal(401);
        });
    })
    describe("POST /api/messages", function() {
        let tokenValid: string;
        let userToken2: string;
        let socket: SocketIOClient.Socket;
        let socket2: SocketIOClient.Socket;
        before(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            userToken2 = await getToken(httpAgent, "test3@example.com", "password");
            socket = await getSocketConnection(tokenValid, 1, RoomUserEvents.JOIN_ROOM, "rooms");
            socket2 = await getSocketConnection(userToken2, 1, RoomUserEvents.JOIN_ROOM, "rooms");
        });
        after(() => {
            socket.close();
            socket2.close();
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent
                .post("/api/messages")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to save message in room", (done) => {
            httpAgent
                .post("/api/messages")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    roomId: 3,
                    message: "first message",
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this room"});
                    done();
                });
        });
        it("should respond with a 422 if board validation failed", async () => {
            const res: Response = await httpAgent
                .post("/api/messages")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    roomId: 1,
                });
            expect(res.status).to.be.equal(422);
            expect(res.body).to.be.deep.equal([
                {
                    context: {
                        key: "message",
                    },
                    message: "\"message\" is required",
                    path: "message",
                    type: "any.required",
                },
            ]);
        });
        it("should respond with a 200 if new message was created", async () => {
            const res: Response = await httpAgent
                .post(`/api/messages`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    message: "first messge",
                    roomId: 1,
                });
            expect(res.status).to.be.equal(200);
            expect(res.body).to.containSubset({
                message: "first messge",
                roomId: 1,
                userId: 1,
            });
        });
        it("should notify all users in room by sockets", (done) => {
            checkAllSockets([socket, socket2], RoomEvents.ADD_MESSAGE, (data) => {
                expect(data).to.containSubset({
                    message: "first message shared",
                    roomId: 1,
                    userId: 1,
                });
            }).then(() => done());

            httpAgent
                .post(`/api/messages`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    message: "first message shared",
                    roomId: 1,
                }).end();

        });
    });

});
