/**
 * Created by sasha on 8/8/17.
 */
import {expect, use} from "chai";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import {cleadDBData, config, createTestProjectUser, getToken} from "../../test.config";
const debug = require("debug")("test:columns:module");
const httpAgent: SuperTest<Test> = agent(app.default);
import {db} from "../../../src/sqldb/index";

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
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (tokenValid = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (tokenInvalid = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
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
                    title: "t",
                    columnId: 1,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "title",
                                limit: 4,
                                value: "t",
                            },
                            message: "\"title\" length must be at least 4 characters long",
                            path: "title",
                            type: "string.min",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with a 422 when position is not defined", (done) =>  {
            httpAgent
                .post(`/api/cards`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    boardId: 1,
                    title: "test",
                    columnId: 1,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        _id: 9,
                        boardId: 1,
                        columnId: 1,
                        position: 5,
                        title: "test",
                        userId: 1,
                    });
                    done();
                });
        });

    });
    describe("PUT /api/cards/{cardId}", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        beforeEach(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (tokenValid = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (tokenInvalid = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        afterEach(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .put("/api/cards/1")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) =>  {
            httpAgent
                .put(`/api/columns/1`)
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
                .put(`/api/cards/1`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    boardId: 1,
                    title: "t",
                    columnId: 1,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "title",
                                limit: 4,
                                value: "t",
                            },
                            message: "\"title\" length must be at least 4 characters long",
                            path: "title",
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
                    boardId: 1,
                    title: "test",
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
                                title: "test title",
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
                    boardId: 1,
                    title: "test",
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

    });
    describe("DELETE /api/cards", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (tokenValid = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (tokenInvalid = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
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
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.empty;
                    expect(res.status).to.be.equal(204);
                    db.Card.findById(1)
                        .then(card =>{
                            expect(card).to.be.null;
                            done();
                        })
                });
        });

    });
});
