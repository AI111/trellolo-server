/**
 * Created by sasha on 6/22/17.
 */
import {expect, use}  from "chai";
import {stat, unlink} from "fs";
import * as path from "path";
import * as request from "supertest";
import {Config} from "../../../src/config/environment";
import * as app from "../../../src/index";
import {db} from "../../../src/sqldb";
import {cleadDBData, config, createTestProjectUser, getToken} from "../../test.config";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
use(require("chai-subset"));

const agent = request.agent(app.default);
describe("Project API:", function () {
    this.timeout(5000);

    before((done) => {
        app.default.on("listening", () => {
            console.log("listening");
            done();
        });
    });

    describe("GET /api/projects", () =>  {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));
        });
        after(() =>  {
            return cleadDBData();
        });
        it("should return user user project list", (done) =>  {
            agent
                .get("/api/projects")
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    console.log(res.body);
                    expect(res.body).to.containSubset([
                        {
                            _id: 1,
                            title: "title 1",
                            description: "description 1",
                        },
                    ]);
                    done();
                });
        });

        it("should respond with a 401 when not authenticated", (done) =>  {
            agent
                .get("/api/projects")
                .expect(401)
                .end(done);
        });
    });
    describe("POST /api/projects", () =>  {
        let tokenValid: string;
        let tokenInvalid: string;
        let testProject;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));

        });
        after(() =>  {
            return cleadDBData();
        });
        it("Check new Project in DB", (done) => {
            agent.post("/api/projects")
                .field("title", config.projectName)
                .attach("icon", config.icon)
                .set("authorization", `Bearer ${tokenValid}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    testProject = res.body;
                    db.Project.findOne({where: {title: config.projectName}})
                        .then((project) => {
                            expect(project.dataValues).to.containSubset({
                                title: config.projectName,
                                icon: res.body.icon,
                            });
                            stat(path.join(Config.root, res.body.icon), (err) => {
                                expect(err).is.null;
                                return done();
                            });
                        });
                });

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
        it("should respond with a 401 when not authenticated", (done) =>  {
            agent
                .get("/api/projects")
                .expect(401)
                .end(done);
        });
        after((done) => {
            unlink(testProject.icon, (err) => {
                if (err) console.error(err);
                return done();
            });
        });
    });
    describe("PUT /api/projects", () =>  {
        let tokenValid: string;
        let tokenInvalid: string;
        let icon: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => tokenValid = token)
                .then(() => getToken(agent, "test2@example.com", "password"))
                .then((token) => (tokenInvalid = token));
        });
        after(() =>  {
            return cleadDBData();
        });
        it("should respond with a 401 when not authenticated", (done) =>  {
            agent
                .put("/api/projects/1")
                .expect(401)
                .end(done);
        });
        it("should respond with a 403 when access not allowed", (done) =>  {
            agent
                .put(`/api/projects/${1}`)
                .set("authorization", `Bearer ${tokenInvalid}`)
                .field("title", "updated project")
                .expect("Content-Type", /json/)
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({ message: "Yo not have access rights for editing this project" });
                    done();
                });
        });
        it("should change only title and img", (done) =>  {
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
        after((done) => {
            if (icon)unlink(icon, (err) => {
                if (err) console.error(err);
                return done();
            });
        });
    });
    describe("GET /api/projects/latest", () =>  {
        let tokenValid: string;
        let tokenInvalid: string;
        before(() =>  {
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
        after(() =>  {
            return cleadDBData();
        });
        it("should return user user project list", (done) =>  {
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

        it("should respond with a 401 when not authenticated", (done) =>  {
            agent
                .get("/api/projects/latest")
                .expect(401)
                .end(done);
        });
    });

});
