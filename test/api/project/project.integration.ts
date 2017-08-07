/**
 * Created by sasha on 6/22/17.
 */
import {expect, use} from "chai";
import * as request from "supertest";
import * as app from "../../../src/index";
import {db} from "../../../src/sqldb";
import {cleadDBData, config, createTestProjectUser, getToken} from "../../test.config";
import {deleteFiles} from "../../test.helper";
const debug = require("debug")("test.project");

use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

const agent = request.agent(app.default);
describe("Project API:", function() {
    this.timeout(5000);
    //
    before((done) => {
        app.default.on("listening", () => {
            console.log("listening");
            done();
        });
    });

    describe("GET /api/projects", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() => {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));
        });
        after(() => {
            return cleadDBData();
        });
        it("should return user user project list", (done) => {
            agent
                .get("/api/projects")
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    debug(res.body);
                    expect(res.body).to.containSubset([
                        {
                            _id: 1,
                            description: "description 1",
                            title: "title 1",
                            users: [
                                {
                                    _id: 1,
                                    avatar: "uploads/pop.jpg",
                                    email: "test@example.com",
                                },
                            ],
                        },
                        {
                            _id: 2,
                            description: "description 2",
                            title: "title 2",
                            users: [
                                {
                                    _id: 2,
                                    avatar: "uploads/pop.jpg",
                                    email: "test2@example.com",
                                },
                                {
                                    _id: 1,
                                    avatar: "uploads/pop.jpg",
                                    email: "test@example.com",
                                },
                            ],
                        },
                    ]);
                    done();
                });
        });

        it("should respond with a 401 when not authenticated", (done) => {
            agent
                .get("/api/projects")
                .expect(401)
                .end(done);
        });
    });
    describe("POST /api/projects", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let iconGenerated: string;
        let iconSaved: string;
        before(() => {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));

        });
        after(() => {
            return cleadDBData();
        });
        it("Should return error without required field name", (done) => {
            agent.post("/api/projects")
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(500)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            message: "",
                            path: "title",
                            type: "notNull Violation",
                            value: null,
                        },
                    ]);
                    done();
                });
        });
        it("Should saved project and generate icon", (done) => {
            agent.post("/api/projects")
                .set("authorization", `Bearer ${tokenValid}`)
                .field("title", "test project title")
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    iconGenerated = res.body.icon;
                    expect(res.body.title).to.be.equal("test project title");
                    expect(res.body.icon).to.be.a("string");
                    done();
                });
        });
        it("Should saved project with icon generate icon", (done) => {
            agent.post("/api/projects")
                .set("authorization", `Bearer ${tokenValid}`)
                .field("title", "test project title")
                .attach("icon", config.icon)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    iconSaved = res.body.icon;
                    expect(res.body.title).to.be.equal("test project title");
                    expect(res.body.icon).to.be.a("string");
                    done();
                });
        });
        it("should respond with a 401 when not authenticated", (done) => {
            agent
                .get("/api/projects")
                .expect(401)
                .end(done);
        });
        after(() => {
            return deleteFiles([iconGenerated, iconSaved]);
        });
    });
    describe("PUT /api/projects", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        let icon: string;
        before(() => {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));
        });
        after(() => {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) => {
            agent
                .put("/api/projects/1")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when access not allowed", (done) => {
            agent
                .put(`/api/projects/${1}`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .field("title", "updated project")
                .expect("Content-Type", /json/)
                .expect(403)
                .end((err, res) => {
                    expect(res.body)
                        .to.be.deep.equal({message: "Yo not have access rights for editing this project"});
                    done();
                });
        });
        it("should change only title and img", (done) => {
            agent
                .put(`/api/projects/${1}`)
                .set("authorization", `Bearer ${tokenValid}`)
                .field("title", "updated project")
                .attach("icon", config.icon)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    icon = res.body.icon;
                    return db.Project.findById(1)
                        .then((pr) => {
                            expect(pr.dataValues.title).to.be.equal("updated project");
                            expect(pr.dataValues.icon).to.be.equal(res.body.icon);
                            expect(pr.dataValues.description).to.be.equal("description 1");
                            return done();
                        });
                });
        });
        after(() => {
            return deleteFiles([icon]);
        });
    });
    describe("GET /api/projects/latest", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() => {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token))
                .then(() => {
                    db.Project.findById(1)
                        .then((project) => project.updateAttributes({title: "new title"}));
                });
        });
        after(() => {
            return cleadDBData();
        });
        it("should return user user project list", (done) => {
            agent
                .get("/api/projects/latest")
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    expect(res.body).not.to.be.an("array");
                    expect(res.body).to.containSubset(
                        {
                            _id: 1,
                            title: "new title",
                            description: "description 1",
                        },
                    );
                    done();
                });
        });

        it("should respond with a 401 when not authenticated", (done) => {
            agent
                .get("/api/projects/latest")
                .expect(401)
                .end(done);
        });
    });
    describe("GET /api/projects/{projectId}/boards", () => {
        let user1Token: string;
        let user2Token: string;
        before(() => {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => user1Token = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (user2Token = token));
        });
        after(function() {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", function(done) {
            agent
                .get(`/api/projects/${1}/boards`)
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", function(done) {
            agent
                .get(`/api/projects/${1}/boards`)
                .set("authorization", `Bearer ${user2Token}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this project"});
                    done();
                });
        });
        it("should return list of user projects", function(done) {
            agent
                .get(`/api/projects/1/boards`)
                .set("authorization", `Bearer ${user1Token}`)
                .expect(200)
                .end((err, res) => {
                    debug("%O", res.body);
                    expect(res.body).to.containSubset([
                        {
                            _id: 1,
                            name: "board 1",
                            projectId: 1,
                            description: "description 1",
                            users: [
                                {
                                    email: "test@example.com",
                                    name: "Fake User",
                                    avatar: "uploads/pop.jpg",
                                    _id: 1,
                                },
                            ],
                        }
                    ]);
                    done();
                });
        });
        it("should return 404 when boards not found", function(done) {
            agent
                .get(`/api/projects/3/boards`)
                .set("authorization", `Bearer ${user2Token}`)
                .expect(200)
                .end((err, res) => {
                    debug("404 %O", res.body);
                    expect(res.body).to.be.empty;
                    expect(res.status).to.be.equal(404);
                    done();
                });
        });
    });
    describe("GET /api/projects/{projectId}/users", () => {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() => {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));
        });
        after(function() {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", function(done) {
            agent
                .get(`/api/projects/${1}/users`)
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when user not have access to edit project", function(done) {
            agent
                .get(`/api/projects/${1}/users`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "Yo not have access rights for editing this project"});
                    done();
                });
        });
        it("should respond with 200 and list of project users if criteria is empty", function(done) {
            agent
                .get(`/api/projects/${1}/users`)
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.containSubset([
                        {
                            _id: 1,
                            avatar: "uploads/pop.jpg",
                            email: "test@example.com",
                            name: "Fake User",
                        },
                        {
                            _id: 3,
                            avatar: "uploads/pop.jpg",
                            email: "test3@example.com",
                            name: "Fake User 3",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with array of users who have similar", function(done) {
            agent
                .get(`/api/projects/${1}/users`)
                .set("authorization", `Bearer ${tokenValid}`)
                .query({email: "3"})
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.containSubset([
                        {
                            _id: 3,
                            avatar: "uploads/pop.jpg",
                            email: "test3@example.com",
                            name: "Fake User 3",
                        },
                    ]);
                    done();
                });
        });
        it("should respond with 404 when user with email not found", function(done) {
            agent
                .get(`/api/projects/${1}/users`)
                .query({email: "wrongMail"})
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.be.empty;
                    expect(res.status).to.be.equal(404);
                    done();
                });
        });
    });

});
