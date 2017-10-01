/**
 * Created by sasha on 8/8/17.
 */
import {expect, use} from "chai";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import { config,  getSocketConnection, getToken} from "../../test.config";
const debug = require("debug")("test:columns:module");
const httpAgent: SuperTest<Test> = agent(app.default);
import * as Promise from "bluebird";
import {ActivityMessagesEnum as msg} from "../../../src/models/activity/IActivity";
import {db} from "../../../src/sqldb/index";
import {cleadDBData, createTestProjectUser} from "../../test.seed";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

describe("Room API:", function() {
    this.timeout(5000);
    // before((done) => {
    //     app.default.on("listening", () => {
    //         console.log("listening//////////////");
    //         done();
    //     });
    // });
    describe("POST /api/rooms", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;
        beforeEach(async () =>  {
            await createTestProjectUser();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            return ;
        });
        afterEach(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .post("/api/rooms")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) =>  {
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
        it("should respond with a 422 when data not valid", (done) =>  {
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
        it("should respond with a 403 when users not in same project", (done) =>  {
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
        it("should respond with a 200 when ew room was created", (done) =>  {
            httpAgent
                .post(`/api/rooms`)
                .set("authorization", `Bearer ${tokenValid}`)
                .send({
                    projectId: 1,
                    name: "all chat",
                    users: [3],
                })
                .expect(403)
                .end(async (err, res) => {
                    debug(res.body);
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
                        creator: 1,
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
});
