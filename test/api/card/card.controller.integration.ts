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

describe("Column API:", () => {
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
        it("should respond with a 200 when card was created", (done) =>  {
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
                        _id: 2,
                        boardId: 1,
                        columnId: 1,
                        position: 2,
                        title: "test",
                        userId: 1,
                    });
                    done();
                });
        });

    });
});
