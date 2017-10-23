/**
 * Created by sasha on 8/8/17.
 */
import {expect, use} from "chai";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import {RoomUserEvents} from "../../../src/models/message/IMessage";
import {db} from "../../../src/sqldb/index";
import {getSocketConnection, getToken} from "../../test.config";
import {cleadDBData, createTestProjectUser} from "../../test.seed";

const debug = require("debug")("test:columns:module");
const httpAgent: SuperTest<Test> = agent(app.default);

use(require("sinon-chai"));
use(require("chai-arrays"));
use(require("chai-things"));
use(require("chai-subset"));

describe("Room API:", function() {
    this.timeout(5000);
    // before((done) => app.default.on("listening", () => done()));

    describe("GET /api/rooms", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;

        before(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            // socket = await getRoomConnection(tokenInvalid, 3);
            return;
        });
        after(() => {
            // socket.close();
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent
                .get("/api/rooms")
                .expect(401)
                .end(done);
        });
        it("should respond with list of user rooms", (done) => {
            httpAgent
                .get(`/api/rooms`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.containSubset([
                        {
                            _id: 3,
                            creatorId: 2,
                            name: "room31",
                            projectId: 1,
                            users: [
                                {
                                    _id: 2,
                                    avatar: "uploads/pop.jpg",
                                    email: "test2@example.com",
                                    name: "Fake User 2",
                                },
                                {
                                    _id: 3,
                                    avatar: "uploads/pop.jpg",
                                    email: "test3@example.com",
                                    name: "Fake User 3",
                                },
                            ],
                        },
                    ]);
                    done();
                });
        });
    });
    describe("GET /api/rooms/:id", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;

        before(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            socket = await getSocketConnection(tokenInvalid, 3, RoomUserEvents.JOIN_ROOM, "rooms");
            return;
        });
        after(() => {
            socket.close();
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent
                .get("/api/rooms/1")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) => {
            httpAgent
                .get(`/api/rooms/1`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this room"});
                    done();
                });
        });
        it("should return room with users array", (done) => {
            httpAgent
                .get(`/api/rooms/1`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({projectId: 1})
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.containSubset({
                        _id: 1,
                        name: "room1",
                        creatorId: 1,
                        projectId: 1,
                        users: [
                            {
                                UserToRoom: {
                                    online: false,
                                },
                                _id: 1,
                                avatar: "uploads/pop.jpg",
                                email: "test@example.com",
                                name: "Fake User",
                            }, {
                                UserToRoom: {
                                    online: false,
                                },
                                _id: 3,
                                avatar: "uploads/pop.jpg",
                                email: "test3@example.com",
                                name: "Fake User 3",
                            },
                        ],

                    });
                    done();
                });
        });
        it("should return room with users online", async () => {
            const res = await httpAgent
                .get(`/api/rooms/3`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .then();
            expect(res.status).to.be.equal(200);
            expect(res.body).to.containSubset({
                _id: 3,
                name: "room31",
                creatorId: 2,
                projectId: 1,
                users: [
                    {
                        UserToRoom: {
                            online: true,
                        },
                        _id: 2,
                        avatar: "uploads/pop.jpg",
                        email: "test2@example.com",
                        name: "Fake User 2",
                    }, {
                        UserToRoom: {
                            online: false,
                        },
                        _id: 3,
                        avatar: "uploads/pop.jpg",
                        email: "test3@example.com",
                        name: "Fake User 3",
                    },
                ],

            });
            return;
        });

    });
    describe("GET /api/rooms/:id/messages", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;

        before(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            socket = await getSocketConnection(tokenInvalid, 3, RoomUserEvents.JOIN_ROOM, "rooms");
            return;
        });
        after(() => {
            socket.close();
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent
                .get("/api/rooms/1/messages")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) => {
            httpAgent
                .get(`/api/rooms/1/messages`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this room"});
                    done();
                });
        });
        it("should return sorted message", (done) => {
            httpAgent
                .get(`/api/rooms/1/messages`)
                .set("authorization", `Bearer ${tokenValid}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.rows).to.be.ofSize(50);
                    expect(res.body).to.containSubset({
                        count: 100,
                        offset: 0,
                        limit: 50,
                        rows: [
                            {
                                _id: 99,
                                roomId:1,
                                message: "test message 99",
                                senderId: 3,
                            },
                            {
                                _id: 50,
                                roomId: 1,
                                message: "test message 50",
                                senderId: 1,
                            },
                        ],
                    })
                    expect(res.body.rows.map((el) => el.createdAt).reverse()).to.be.sorted();
                    done();
                });
        });
        it("should return message array with pagination", (done) => {
            httpAgent
                .get(`/api/rooms/1/messages`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({
                    limit: 60,
                    offset: 10,
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.rows).to.be.ofSize(60);
                    expect(res.body).to.containSubset({
                        count: 100,
                        offset: 10,
                        limit: 60,
                        rows: [
                            {
                                _id: 89,
                                roomId:1,
                                message: "test message 89",
                                senderId: 3,
                            },
                            {
                                _id: 30,
                                roomId: 1,
                                message: "test message 30",
                                senderId: 1,
                            },
                        ],
                    })
                    expect(res.body.rows.map((el) => el.createdAt).reverse()).to.be.sorted();
                    done();
                });
        });
        it("should return message array with last message that was selected", (done) => {
            httpAgent
                .get(`/api/rooms/1/messages`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({
                    limit: 60,
                    offset: 10,
                    messageId: 20,
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.rows).to.be.ofSize(60);
                    expect(res.body).to.containSubset({
                        count: 100,
                        offset: 20,
                        limit: 60,
                        rows: [
                            {
                                _id: 79,
                                roomId:1,
                                message: "test message 79",
                                senderId: 3,
                            },
                            {
                                _id: 20,
                                roomId: 1,
                                message: "test message 20",
                                senderId: 1,
                            },
                        ],
                    })
                    expect(res.body.rows.map((el) => el.createdAt).reverse()).to.be.sorted();
                    done();
                });
        });
        // it("should return room with users online", async () => {
        //     const res = await httpAgent
        //         .get(`/api/rooms/3`)
        //         .set("authorization", `Bearer ${tokenInvalid}`)
        //         .then();
        //     expect(res.status).to.be.equal(200);
        //     expect(res.body).to.containSubset({
        //         _id: 3,
        //         name: "room31",
        //         creatorId: 2,
        //         projectId: 1,
        //         users: [
        //             {
        //                 UserToRoom: {
        //                     online: true,
        //                 },
        //                 _id: 2,
        //                 avatar: "uploads/pop.jpg",
        //                 email: "test2@example.com",
        //                 name: "Fake User 2",
        //             }, {
        //                 UserToRoom: {
        //                     online: false,
        //                 },
        //                 _id: 3,
        //                 avatar: "uploads/pop.jpg",
        //                 email: "test3@example.com",
        //                 name: "Fake User 3",
        //             },
        //         ],
        //
        //     });
        //     return;
        // });

    });
    describe("POST /api/rooms", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        beforeEach(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            return;
        });
        afterEach(() => {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent
                .post("/api/rooms")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) => {
            httpAgent
                .post(`/api/rooms`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .send({projectId: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this project"});
                    done();
                });
        });
        it("should respond with a 422 when data not valid", (done) => {
            httpAgent
                .post(`/api/rooms`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    projectId: 1,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "name",
                            },
                            message: "\"name\" is required",
                            path: "name",
                            type: "any.required",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with a 403 when users not in same project", (done) => {
            httpAgent
                .post(`/api/rooms`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    projectId: 1,
                    name: "all chat",
                    users: [2, 3],
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({
                        message: "This users not assigned to this project",
                    });
                    done();
                });
        });
        it("should respond with a 200 when room was created", (done) => {
            httpAgent
                .post(`/api/rooms`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    projectId: 1,
                    name: "all chat",
                    users: [3],
                })
                .expect(403)
                .end( async (err, res) => {
                    const room = await db.Room.findOne({
                        where: {
                            _id: res.body._id,
                        },
                        include: [
                            {
                                model: db.User,
                                as: "users",
                            },
                        ],
                    });
                    expect(room).to.not.null;
                    expect(room.toJSON()).to.containSubset({
                        name: "all chat",
                        creatorId: 1,
                        projectId: 1,
                        users: [
                            {_id: 3},
                            {_id: 1},
                        ],
                    });
                    done();
                });
        });
    });
    describe("DELETE /api/rooms/:id", () => {
        let tokenValid: string;
        let tokenInvalid: string;

        before(async () => {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            return;
        });
        after(() => {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent
                .get("/api/rooms/3")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) => {
            httpAgent
                .get(`/api/rooms/1`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this room"});
                    done();
                });
        });
    });
});
