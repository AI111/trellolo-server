/**
 * Created by sasha on 7/12/17.
 */
import {expect, use} from "chai";
import {token} from "morgan";
import {agent, SuperTest, Test} from "supertest";
import * as app from "../../../src/index";
import {db} from "../../../src/sqldb/index";
import {cleadDBData, config, createTestProjectUser, getToken} from "../../test.config";

const httpAgent: SuperTest<Test> = agent(app.default);
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

describe("Invite API:", function() {
    // before((done) => {
    //     app.default.on("listening", () => {
    //         console.log("listening//////////////");
    //         done();
    //     });
    // });
    describe("POST /api/invites", () => {
        let user1Token: string;
        let user2Tokn: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (user2Tokn = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent.post("/api/invites")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", (done) =>  {
            httpAgent
                .post(`/api/invites`)
                .set("authorization", `Bearer ${user2Tokn}`)
                .send({projectId: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this project"});
                    done();
                });
        });
        it("should respond with a 422 when invite not send email", (done) =>  {
            httpAgent
                .post(`/api/invites`)
                .set("authorization", `Bearer ${user1Token}`)
                .send({
                    projectId: 1,
                    message: "a",
                })
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            context: {
                                key: "email",
                            },
                            message: "\"email\" is required",
                            path: "email",
                            type: "any.required",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with a 404 when user email not found", (done) =>  {
            httpAgent
                .post(`/api/invites`)
                .set("authorization", `Bearer ${user1Token}`)
                .send({
                    email: "test322@example.com",
                    projectId: 1,
                    message: "hello",
                })
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({
                        message: "User with this email not found",
                    });
                    done();
                });
        });
        it("should respond with a 200 when invite was created", (done) =>  {
            httpAgent
                .post(`/api/invites`)
                .set("authorization", `Bearer ${user1Token}`)
                .send({
                    email: "test3@example.com",
                    projectId: 1,
                    message: "hello",
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        _id: 4,
                        message: "hello",
                        projectId: 1,
                        userFromId: 1,
                        userToId: 3,
                    });
                    done();
                });
        });
    });
    describe("POST /api/invites/{inviteId}/accept", () => {
        let user1Token: string;
        let user2Token: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (user2Token = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent.post("/api/invites/1/accept")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to accept invite", (done) =>  {
            httpAgent
                .post(`/api/invites/1/accept`)
                .set("authorization", `Bearer ${user1Token}`)
                .send({projectId: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({ message: "You not have rights to accept this invite"});
                    done();
                });
        });
        it("should respond with a 200 when user accept invite and include user to team", (done) =>  {
            httpAgent
                .post(`/api/invites/3/accept`)
                .set("authorization", `Bearer ${user2Token}`)
                .send({projectId: 1})
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({});
                    expect(res.status).to.be.equal(200);
                    db.Team.findOne({
                        where: {
                            projectId: 2,
                            userId: 3,
                        },
                    })
                        .then((user) => {
                            expect(user.dataValues).to.containSubset({
                                projectId: 2,
                                userId: 3,
                                accessRights: "user",
                            });
                            done();
                        });

                });
        });
    });
    describe("DELETE /api/invites/{inviteId}", () => {
        let user1Token: string;
        let user2Token: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (user2Token = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent.delete("/api/invites/1")
                .expect(401)
                .end(done);
        });
        // it("should respond with a 403 when user not have access to accept invite", (done) =>  {
        //     httpAgent
        //         .post(`/api/invites/1/accept`)
        //         .set("authorization", `Bearer ${user1Token}`)
        //         .send({projectId: 1})
        //         .expect(403)
        //         .end((err, res) => {
        //             expect(res.body).to.be.deep.equal({ message: "You not have rights to accept this invite"});
        //             done();
        //         });
        // });
        // it("should respond with a 200 when user accept invite and include user to team", (done) =>  {
        //     httpAgent
        //         .post(`/api/invites/3/accept`)
        //         .set("authorization", `Bearer ${user2Token}`)
        //         .send({projectId: 1})
        //         .expect(403)
        //         .end((err, res) => {
        //             expect(res.body).to.be.deep.equal({});
        //             expect(res.status).to.be.equal(200);
        //             db.Team.findOne({
        //                 where: {
        //                     projectId: 2,
        //                     userId: 3,
        //                 },
        //             })
        //                 .then(user => {
        //                     expect(user.dataValues).to.containSubset({
        //                         projectId: 2,
        //                         userId: 3,
        //                         accessRights: "user",
        //                     })
        //                     done();
        //                 })
        //
        //         });
        // });
    });
    describe("GET /api/invites", () => {
        let user1Token: string;
        let user2Token: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(httpAgent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(httpAgent, "test3@example.com", "password"))
                .then((token) => (user2Token = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            httpAgent.get("/api/invites")
                .expect(401)
                .end(done);
        });
        it("should respond with empty rows array when invites not found", (done) =>  {
            httpAgent
                .get(`/api/invites`)
                .set("authorization", `Bearer ${user1Token}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({
                        count: 0,
                        limit: 50,
                        offset: 0,
                        rows: [],
                    });
                    done();
                });
        });
        it("should respond with user invite list in rows array", (done) =>  {
            httpAgent
                .get(`/api/invites`)
                .set("authorization", `Bearer ${user2Token}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.containSubset({
                        count: 3,
                        limit: 50,
                        offset: 0,
                        rows: [
                            {
                                _id: 1,
                                message: "team invite",
                                projectId: 1,
                                userFromId: 1,
                                userToId: 3,
                            }, {
                                _id: 2,
                                message: "team invite",
                                projectId: 1,
                                userFromId: 1,
                                userToId: 3,
                            }, {
                                _id: 3,
                                message: "team invite",
                                projectId: 2,
                                userFromId: 2,
                                userToId: 3,
                            },
                        ],
                    });
                    done();
                });
        });
        // it("should respond with a 200 when user accept invite and include user to team", (done) =>  {
        //     httpAgent
        //         .post(`/api/invites/3/accept`)
        //         .set("authorization", `Bearer ${user2Token}`)
        //         .send({projectId: 1})
        //         .expect(403)
        //         .end((err, res) => {
        //             expect(res.body).to.be.deep.equal({});
        //             expect(res.status).to.be.equal(200);
        //             db.Team.findOne({
        //                 where: {
        //                     projectId: 2,
        //                     userId: 3,
        //                 },
        //             })
        //                 .then(user => {
        //                     expect(user.dataValues).to.containSubset({
        //                         projectId: 2,
        //                         userId: 3,
        //                         accessRights: "user",
        //                     })
        //                     done();
        //                 })
        //
        //         });
        // });
    });
});
