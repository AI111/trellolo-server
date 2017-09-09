/**
 * Created by sasha on 8/8/17.
 */
import {expect, use} from "chai";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import { config,  getSocketConnection, getToken} from "../../test.config";
const debug = require("debug")("test:columns:module");
const httpAgent: SuperTest<Test> = agent(app.default);
import {setTimeout} from "timers";
import {db} from "../../../src/sqldb/index";
import {cleadDBData, createTestProjectUser} from "../../test.seed";

use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

describe("Card API:", function() {
    this.timeout(5000);
    // before((done) => {
    //     app.default.on("listening", () => {
    //         console.log("listening//////////////");
    //         done();
    //     });
    // });
    describe("POST /api/cards", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;
        before(async () =>  {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test3@example.com", "password");
            socket = await getSocketConnection(tokenValid, 1);
            return socket;
        });
        after(() =>  {
            socket.off("notify");
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .post("/api/cards")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) =>  {
            httpAgent
                .post(`/api/columns`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .send({boardId: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for using this board"});
                    done();
                });
        });
        it("should respond with a 422 when data not valid", (done) =>  {
            httpAgent
                .post(`/api/cards`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    boardId: 1,
                    description: "t",
                    columnId: 1,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "description",
                                limit: 4,
                                value: "t",
                            },
                            message: "\"description\" length must be at least 4 characters long",
                            path: "description",
                            type: "string.min",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with a 200 when data is valid", (done) =>  {
            httpAgent
                .post(`/api/cards`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    boardId: 1,
                    description: "test",
                    columnId: 1,
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        _id: 9,
                        boardId: 1,
                        columnId: 1,
                        position: 5,
                        description: "test",
                        userId: 1,
                    });
                    console.log("RESP");
                });
            socket.on("notify", (data) => {
                console.log("RESP SOCKET", data);
                expect(data).to.containSubset({ activityType: "CREATE",
                    toState:
                        { _id: 9,
                            boardId: 1,
                            description: "test",
                            columnId: 1,
                            userId: 1,
                            position: 5 },
                    modelName: "Card" });
                setTimeout(done, 500);
                // done();?
            });
        });

    });
    describe("PUT /api/cards/{cardId}", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;

        beforeEach(async () =>  {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test3@example.com", "password");
            socket = await getSocketConnection(tokenValid, 1);
            return tokenInvalid;
        });
        afterEach(async () =>  {
            socket.off("notify");
            return await cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .put("/api/cards/1")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) =>  {
            httpAgent
                .put(`/api/cards/1`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .send({position: 1,
                    columnId: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for using this board"});
                    done();
                });
        });
        it("should respond with a 422 when data not valid", (done) =>  {
            httpAgent
                .put(`/api/cards/1`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    boardId: 1,
                    description: "t",
                    columnId: 1,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "description",
                                limit: 4,
                                value: "t",
                            },
                            message: "\"description\" length must be at least 4 characters long",
                            path: "description",
                            type: "string.min",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with a 200 when card mowed from one too other column", (done) =>  {
            httpAgent
                .put(`/api/cards/2`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    description: "test",
                    columnId: 3,
                    position: 3,
                })
                .expect(403)
                .end((err, res) => {
                    db.Card.findAll({
                        where: {
                            boardId: 1,
                        },
                        raw: true,
                    })
                        .then((cards) => {
                            debug(cards);
                            expect(cards).to.containSubset([
                                {
                                    _id: 2,
                                    position: 3,
                                    columnId: 3,
                                    boardId: 1,
                                },
                                {
                                    _id: 3,
                                    position: 2,
                                    userId: 1,
                                    boardId: 1,
                                    columnId: 1,
                                },
                                {
                                    _id: 7,
                                    description: "test title",
                                    position: 4,
                                    userId: 1,
                                    boardId: 1,
                                    columnId: 3,
                                },

                            ]);
                            done();
                        });
                });
        });
        it("should respond with a 200 when card mowed in column", (done) =>  {
            httpAgent
                .put(`/api/cards/2`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    description: "test",
                    columnId: 1,
                    position: 3,
                })
                .expect(403)
                .end((err, res) => {
                    db.Card.findAll({
                        where: {
                            boardId: 1,
                        },
                        raw: true,
                    })
                        .then((cards) => {
                            debug(cards);
                            expect(cards).to.containSubset([
                                {
                                    _id: 2,
                                    position: 3,
                                    columnId: 1,
                                    boardId: 1,
                                },
                                {
                                    _id: 3,
                                    position: 2,
                                    userId: 1,
                                    boardId: 1,
                                    columnId: 1,
                                },
                                {
                                    _id: 4,
                                    position: 4,
                                    userId: 1,
                                    boardId: 1,
                                    columnId: 1,
                                },

                            ]);
                            done();
                        });
                });
        });
        it("should respond with a 200 when notify all users in room", (done) =>  {
            httpAgent
                .put(`/api/cards/2`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    description: "test",
                    columnId: 1,
                    position: 1,
                })
                .expect(403)
                .end((err, res) => {

                });
            socket.on("notify", (data) => {
                expect(data).to.containSubset({
                        activityType: "UPDATE",
                        fromState: {
                            _id: 2,
                            boardId: 1,
                            columnId: 1,
                            description: "test title",
                            position: 2,
                            userId: 1,
                        },
                        modelName: "Card",
                        toState: {
                            _id: 2,
                            boardId: 1,
                            columnId: 1,
                            description: "test",
                            position: 1,
                            userId: 1,
                        },
                    },
                );
                setTimeout(done, 500);
            });
        });

    });
    describe("DELETE /api/cards", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;

        beforeEach(async () =>  {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test3@example.com", "password");
            socket = await getSocketConnection(tokenValid, 1);
            return socket;
        });
        afterEach(() =>  {
            socket.off("notify");
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .delete("/api/cards/1")
                .expect(401)
                .end(done);
        });
        it("should respond with a 204 when successfully delete card", (done) =>  {
            httpAgent
                .delete(`/api/cards/1`)
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.empty;
                    expect(res.status).to.be.equal(204);
                    db.Card.findById(1)
                        .then((card) => {
                            expect(card).to.be.null;
                            done();
                        });
                });
        });
        it("should respond with a 200 when notify all users in room", (done) =>  {
            httpAgent
                .delete(`/api/cards/1`)
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(204)
                .end((err, res) => {

                });
            socket.on("notify", (data) => {
                console.log("RESP SOCKET", data);
                expect(data).to.containSubset(
                    {
                        activityType: "DELETE",
                        fromState: {
                            _id: 1,
                            boardId: 1,
                            columnId: 1,
                            description: "test title",
                            position: 1,
                            userId: 1,
                        },
                        modelName: "Card",
                    });
                setTimeout(done, 500);
                // done();?
            });
        });

    });
});
