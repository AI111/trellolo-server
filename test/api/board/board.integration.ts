/**
 * Created by sasha on 7/12/17.
 */
import {expect, use} from "chai";
import {number} from "joi";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import {db} from "../../../src/sqldb/index";
import {cleadDBData, config, createTestProjectUser, getToken} from "../../test.config";

const httpAgent: SuperTest<Test> = agent(app.default);
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

describe("Board API:", function() {
    before((done) => {
        app.default.on("listening", () => {
            console.log("listening//////////////");

            done();
        });
    });

    this.timeout(5000);
    describe("GET /api/boards/{boardId}", function() {
        let tokenValid: string;
        let tokenInvalid: string;
        before(function() {
          return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(httpAgent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));
        });
        after(function() {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", function(done) {
            httpAgent
                .get(`/api/boards/1`)
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", function(done) {
            httpAgent
                .get(`/api/boards/1`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for using this board"});
                    done();
                });
        });
        it("should return one board", function(done) {
            httpAgent
                .get(`/api/boards/1`)

                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.containSubset(
                        {
                            _id: 1,
                            name: "board 1",
                            projectId: 1,
                            description: "description 1",
                        });
                    done();
                });
        });
    });
    describe("POST /api/boards", function() {
        let tokenValid: string;
        let tokenInvalid: string;
        before(function() {
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
        after(function() {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", function(done) {
            httpAgent
                .post("/api/boards")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", function(done) {
            httpAgent
                .post("/api/boards")
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Forbidden"});
                    done();
                });
        });
        it("should respond with a 422 if board validation failed", function(done) {
            httpAgent
                .post("/api/boards")
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    projectId: 1,
                })
                .expect(422)
                .end((err, res) => {
                    // console.log(res.body);
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
        it("should respond with a 200 if new board was created", function(done) {
            httpAgent
                .post(`/api/boards`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    name: "test board",
                    projectId: 1,
                })
                .expect(200)
                .end((err, res) => {
                const boardId: number = res.body._id;
                expect(res.body).to.containSubset({
                        name: "test board",
                        projectId: 1,
                    });
                db.BoardToUser.findOne({
                        where: {
                            userId: 1,
                            boardId,
                        },
                    })
                        .then((boardToUser) => {
                            expect(boardToUser).to.not.null;
                            done();
                        });

                });
        });
    });

});
