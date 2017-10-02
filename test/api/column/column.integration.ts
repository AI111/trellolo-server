/**
 * Created by sasha on 7/12/17.
 */
import {expect, use} from "chai";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import {config, getToken} from "../../test.config";
const debug = require("debug")("test:columns:module");
const httpAgent: SuperTest<Test> = agent(app.default);
import {db} from "../../../src/sqldb/index";
import {cleadDBData, createTestProjectUser} from "../../test.seed";
import {ActivityMessagesEnum as msg} from "../../../src/models/activity/IActivity";

use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

describe("Column API:", () =>  {
    // before((done) => {
    //     app.default.on("listening", () => {
    //         console.log("listening//////////////");
    //         done();
    //     });
    // });

    describe("POST /api/columns", () =>  {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (tokenValid = token))
                .then(() => getToken(httpAgent, "test2@example.com", "password"))
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
                .post("/api/columns")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", (done) =>  {
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
        it("should respond with a 403 when board id is not defined in body", (done) =>  {
            httpAgent
                .post(`/api/columns`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "boardId is required field"});
                    done();
                });
        });
        it("should respond with a 422 if column validation failed", (done) =>  {
            httpAgent
                .post(`/api/columns`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    boardId: 1,
                })
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "title",
                            },
                            message: "\"title\" is required",
                            path: "title",
                            type: "any.required",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with a 200 if new column was created", (done) =>  {
            httpAgent
                .post("/api/columns")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    title: "test board",
                    boardId: 1,
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        title: "test board",
                        boardId: 1,
                        position: 6,
                    });
                    done();
                });
        });
        it("should create activity if column was created", (done) =>  {
            httpAgent
                .post("/api/columns")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    title: "test board",
                    boardId: 1,
                })
                .expect(200)
                .end( (err, res) => {
                    db.Activity.findOne({
                        where: {
                            table: db.BoardColumn.getTableName(),
                            userId: 1,
                            projectId: 1,
                            tableId: res.body._id,
                            messageId: msg.CREATE_COLUMN,
                        },
                    })
                        .then((activity) => {
                            expect(activity).to.not.be.null;
                            done();
                        });
                });
        });
    });
    describe("PUT /api/columns/{columnId}", () =>  {
        let tokenValid: string;
        let tokenInvalid: string;
        beforeEach(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (tokenValid = token))
                .then(() => getToken(httpAgent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token))
                .catch((err) => {
                    // console.error(err);
                    return err;
                });
        });
        afterEach(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .put(`/api/columns/5`)
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", (done) =>  {
            httpAgent
                .put(`/api/columns/5`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .send({title: "ads"})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for using this board"});
                    done();
                });
        });
        it("should respond with a 403 when board id is not defined in body", (done) =>  {
            httpAgent
                .put(`/api/columns/5`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for using this board"});
                    done();
                });
        });
        it("should respond with a 200 when move 1 column to middle position", (done) =>  {
            httpAgent
                .put(`/api/columns/4`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    title: "New Title 5",
                    position: 2,
                })
                .expect(200)
                .end((err, res) => {
                    debug(res.body);
                    expect(res.body).to.containSubset({
                        position: 2,
                        boardId: 1,
                        title: "New Title 5",
                    });
                    db.BoardColumn.findAll({
                        where: {
                            boardId: 1,
                        },
                        raw: true,
                        // order:['position']
                    }).then((cols) => {
                        debug(cols);
                        expect(cols).to.containSubset([{
                            _id: 1,
                            boardId: 1,
                            title: "Column 1",
                            position: 1,
                        },
                            {
                                _id: 2,
                                title: "Title 2",
                                boardId: 1,
                                position: 3,
                            }, {
                                _id: 3,
                                title: "Title 3",
                                boardId: 1,
                                position: 4,
                            }, {
                                _id: 4,
                                title: "New Title 5",
                                boardId: 1,
                                position: 2,
                            }, {
                                _id: 5,
                                title: "Title 5",
                                boardId: 1,
                                position: 5,
                            },
                        ]);
                        done();

                    });
                    // done()

                });
        });
        it("should create activity if column was updated", (done) =>  {
            httpAgent
                .put("/api/columns/5")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    title: "test board",
                })
                .expect(200)
                .end( async (err, res) => {
                    const activity = await db.Activity.findOne({
                        where: {
                            table: db.BoardColumn.getTableName(),
                            userId: 1,
                            projectId: 1,
                            tableId: 5,
                            messageId: msg.UPDATE_COLUMN,
                        },
                    })
                    expect(activity).to.not.be.null;
                    done();
                });
        });
    });
    describe("DELETE /api/columns/{columnId}", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        beforeEach(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (tokenValid = token))
                .then(() => getToken(httpAgent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token))
                .catch((err) => {
                    // console.error(err);
                    return err;
                });
        });
        afterEach(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .delete(`/api/columns/5`)
                .expect(401)
                .end(done);
        });
        it("should respond with a 204 when successfully delete column", (done) =>  {
            httpAgent
                .delete(`/api/columns/1`)
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.empty;
                    expect(res.status).to.be.equal(204);
                    db.BoardColumn.findById(1)
                        .then((col) => {
                            expect(col).to.be.null;
                        })
                        .then(() => db.Card.findAll({where: {columnId: 1}}))
                        .then((cards) => {
                            expect(cards).to.be.an("array").that.is.empty;
                            done();
                        });
                });
        });
        it("should create activity if column was updated", (done) =>  {
            httpAgent
                .delete("/api/columns/5")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    title: "test board",
                })
                .expect(200)
                .end( async (err, res) => {
                    const activity = await db.Activity.findOne({
                        where: {
                            table: db.BoardColumn.getTableName(),
                            userId: 1,
                            projectId: 1,
                            tableId: 5,
                            messageId: msg.DELETE_COLUMN,
                        },
                    })
                    expect(activity).to.not.be.null;
                    done();
                });
        });

    });
});
