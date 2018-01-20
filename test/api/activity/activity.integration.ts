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
import {cleadDBData, createTestActivates, createTestProjectUser} from "../../test.seed";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));
use(require("chai-arrays"));

describe("Activity API:", function() {
    this.timeout(5000);
    before((done) => app.default.on("listening", () => done()));
    describe("GET /api/activities", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let socket: SocketIOClient.Socket;
        beforeEach(async () =>  {
            await createTestProjectUser();
            await createTestActivates();
            tokenValid = await getToken(httpAgent, "test@example.com", "password");
            tokenInvalid = await getToken(httpAgent, "test2@example.com", "password");
            return ;
        });
        afterEach(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            httpAgent
                .get("/api/activities")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit board", (done) =>  {
            httpAgent
                .get(`/api/activities`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .query({project: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this project"});
                    done();
                });
        });
        it("should respond with a 200 and return data with pagination", (done) =>  {
            httpAgent
                .get(`/api/activities`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({project: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        count: 165,
                        limit: 50,
                        offset: 0,
                        rows: [],
                    });
                    expect(res.body.rows.length).to.be.equal(50);
                    expect(res.body.rows.some((el) => el.projectId !== 1)).to.be.false;
                    done();
                });
        });
        it("should respond with a 200 and return last page", (done) =>  {
            httpAgent
                .get(`/api/activities`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({
                    project: 1,
                    limit: 50,
                    offset: 150,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        count: 165,
                        limit: 50,
                        offset: 150,
                        rows: [],
                    });
                    expect(res.body.rows.length).to.be.equal(15);
                    expect(res.body.rows.some((el) => el.projectId !== 1)).to.be.false;
                    done();
                });
        });
        it("should respond with a 200 and first filtered page", (done) =>  {
            httpAgent
                .get(`/api/activities`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({
                    project: 1,
                    table: "cards",
                    limit: 10,
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        count: 55,
                        limit: 10,
                        offset: 0,
                        rows: [],
                    });
                    expect(res.body.rows.length).to.be.equal(10);
                    expect(res.body.rows.some((el) => el.projectId !== 1)).to.be.false;
                    expect(res.body.rows.some((el) => el.table === "cards")).to.be.true;
                    done();
                });
        });
        it("should respond with a 200 and sort results", (done) =>  {
            httpAgent
                .get(`/api/activities`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({
                    project: 1,
                    limit: 200,
                    sort: "table",
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        count: 165,
                        limit: 200,
                        offset: 0,
                        rows: [],
                    });
                    expect(res.body.rows.map((el) => el.table)).to.be.sorted();
                    expect(res.body.rows.some((el) => el.projectId !== 1)).to.be.false;
                    expect(res.body.rows.some((el) => el.table === "cards")).to.be.true;
                    done();
                });
        });
        it("should respond with a 200 and sort results reverse", (done) =>  {
            httpAgent
                .get(`/api/activities`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({
                    project: 1,
                    limit: 200,
                    sort: "-table",
                })
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        count: 165,
                        limit: 200,
                        offset: 0,
                        rows: [],
                    });
                    expect(res.body.rows.map((el) => el.table).reverse()).to.be.sorted();
                    expect(res.body.rows.some((el) => el.projectId !== 1)).to.be.false;
                    expect(res.body.rows.some((el) => el.table === "cards")).to.be.true;
                    done();
                });
        });
    });
});
