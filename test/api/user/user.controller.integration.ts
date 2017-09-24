/**
 * Created by sasha on 6/22/17.
 */

import {expect, use} from "chai";
import {stat, unlink} from "fs";
import * as path from "path";
import * as request from "supertest";
import {config as serverConfig} from "../../../src/config/environment/index";
import * as app from "../../../src/index";
import {db} from "../../../src/sqldb";
import {config,  getToken} from "../../test.config";
import {cleadDBData, createTestProjectUser} from "../../test.seed";

use(require("chai-subset"));
use(require("chai-as-promised"));

const agent = request.agent(app.default);
const debug = require("debug")("test.user.controller.integration");

describe("User API:", function() {
    let user;
    // before((done) => {
    //     app.default.on("listening", () => {
    //         console.log("listening//////////////");
    //         done();
    //     });
    // });
    // Clear users before testing

    describe("GET /api/users", () => {
        let user1Token: string;
        let user2Token: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(agent, "test3@example.com", "password"))
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
            agent.get("/api/invites")
                .expect(401)
                .end(done);
        });
        it("should respond with empty rows array when invites not found", (done) =>  {
            agent
                .get(`/api/users`)
                .set("authorization", `Bearer ${user1Token}`)
                .expect(424)
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
        it("should respond with 404 whe user not found", (done) =>  {
            agent
                .get(`/api/users`)
                .query({email: "test31@example.com"})
                .set("authorization", `Bearer ${user2Token}`)
                .expect(404)
                .end((err, res) => {
                    debug(res.body);
                    expect(res.body).to.be.empty;
                    expect(res.status).to.be.equal(404);
                    done();
                });
        });
        it("should respond with user  who has this email  ", (done) =>  {
            agent
                .get(`/api/users`)
                .query({email: "test3@example.com"})
                .set("authorization", `Bearer ${user2Token}`)
                .expect(403)
                .end((err, res) => {
                    debug(res.body);
                    expect(res.body).to.containSubset([{
                        _id: 3,
                        email: "test3@example.com",
                        avatar: "uploads/pop.jpg",
                    }]);
                    done();
                });
        });
    });

    describe("GET /api/users/me", function() {
        let user1Token: string;
        let user2Token: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(agent, "test3@example.com", "password"))
                .then((token) => (user2Token = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
            return cleadDBData();
        });

        it("should respond with a user profile when authenticated", function(done) {
            agent
                .get("/api/users/me")
                .set("authorization", `Bearer ${user1Token}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    debug(res.body);
                    expect(res.body).to.containSubset(
                        { _id: 1,
                            name: "Fake User",
                            email: "test@example.com",
                            avatar: "uploads/pop.jpg",
                            role: "user",
                        },
                    );
                    done();
                });
        });

        it("should respond with a 401 when not authenticated", function(done) {
            agent
                .get("/api/users/me")
                .expect(401)
                .end(done);
        });
    });
    describe("POST /api/users", function() {
        let user1Token: string;
        let user2Token: string;
        before(() =>  {
            return createTestProjectUser()
                .then(() => getToken(agent, "test@example.com", "password"))
                .then((token) => (user1Token = token))
                .then(() => getToken(agent, "test3@example.com", "password"))
                .then((token) => (user2Token = token))
                .catch((err) => {
                    console.error(err);
                    return err;
                });
        });
        after(() =>  {
            return cleadDBData();
        });
        let avatarPath: string ;
        it("should response with error when token not included", function(done) {
            agent.post("/api/users")
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({message: "captcha token invalid"});
                    done();
                });
        });
        it("should response with error when email not valid", function(done) {
            agent.post("/api/users")
                .field("email", "notValidMail")
                .field("password", "1234")
                .field("token", "token")
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            message: '"email" must be a valid email',
                            path: "email",
                            type: "string.email",
                            context: {value: "notValidMail", key: "email"},
                        },
                    ]);
                    done();
                });
        });
        it("should response with error when password not valid", function(done) {
            agent.post("/api/users")
                .field("email", "example@example.com")
                .field("password", "1234")
                .field("token", "token")
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            message: '"password" length must be at least 6 characters long',
                            path: "password",
                            type: "string.min",
                            context: { limit: 6, value: "1234", key: "password" },
                        },
                    ]);
                    done();
                });
        });
        it("should response with error when email already in use", function(done) {
            agent.post("/api/users")
                .field("email", "test@example.com")
                .field("password", "123456")
                .field("token", "token")
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            message: "The specified email address is already in use.",
                            path: "email",
                            type: "unique violation",
                            value: "test@example.com",
                        },
                    ]);
                    done();
                });
        });
        it("should response with token when all data correct", function(done) {
            agent.post("/api/users")
                .field("email", "testmail@example.com")
                .field("password", "123456")
                .field("token", "token")
                .expect(200)
                .end((err, res) => {
                    expect(res.body.token.length).to.be.equal(139);
                    done();
                });
        });
        it("should save profile and icon when data is correct", function(done) {
            agent.post("/api/users")
                .field("name", config.projectName)
                .attach("avatar", config.icon)
                .field("email", config.testEmail)
                .field("password", "123456")
                .field("token", "token")
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    expect(res.body.token.length).to.be.equal(139);
                    expect(res.body.email).to.be.equal(config.testEmail);
                    expect(res.body.name).to.be.equal(config.projectName);
                    db.User.find({
                        where: {
                            email: config.testEmail,
                        },
                    }).then((user) => {
                        avatarPath = user.dataValues.avatar;
                        expect(user.dataValues.name).to.be.equal(config.projectName);
                        expect(user.dataValues.email).to.be.equal(config.testEmail);
                        stat(path.join(serverConfig.root, user.avatar), (err) => {
                            expect(err).is.null;
                            done();
                        });
                    });
                    // done();
                });
        });
        after(function(done) {
            unlink(path.join(serverConfig.root, avatarPath), (err) => {
                if (err)console.error(err);
                return done();
            });
        });
    });
});
