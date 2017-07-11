/**
 * Created by sasha on 6/22/17.
 */

import * as app from '../../../src/index';
import {db} from '../../../src/sqldb';
import * as request from 'supertest';
import {expect, use}  from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {config} from "../../test.config";
import {stat, unlink} from "fs";
import {Config} from "../../../src/config/environment/index";
import * as path from "path";
use(chaiAsPromised);
const agent = request.agent(app.default);
describe('User API:', function () {
    var user;

    // Clear users before testing
    before(function () {
        return db.User.destroy({where: {}}).then(function () {
            user = db.User.build({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password'
            });
            return user.save();
        });
    });

    // Clear users after testing
    after(function () {
        return db.User.destroy({where: {}});
    });

    describe('GET /api/users/me', function () {
        var token;

        before(function (done) {
            agent
                .post('/auth/local')
                .send({
                    email: 'test@example.com',
                    password: 'password'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should respond with a user profile when authenticated', function (done) {
            agent
                .get('/api/users/me')
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body._id.toString()).to.equal(user._id.toString());
                    done();
                });
        });

        it('should respond with a 401 when not authenticated', function (done) {
            agent
                .get('/api/users/me')
                .expect(401)
                .end(done);
        });
    });
    describe('POST /api/users', function () {
        var avatarPath: string ;
        it('should response with error when token not included', function (done) {
            agent.post('/api/users')
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal({"message": "captcha token invalid"});
                    done()
                })
        });
        it('should response with error when email not valid', function (done) {
            agent.post('/api/users')
                .field('email', 'notValidMail')
                .field('password', '1234')
                .field('token', 'token')
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            message: '"email" must be a valid email',
                            path: 'email',
                            type: 'string.email',
                            context: {value: 'notValidMail', key: 'email'}
                        }
                    ]);
                    done()
                })
        });
        it('should response with error when password not valid', function (done) {
            agent.post('/api/users')
                .field('email', 'example@example.com')
                .field('password', '1234')
                .field('token', 'token')
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            message: '"password" length must be at least 6 characters long',
                            path: 'password',
                            type: 'string.min',
                            context: { limit: 6, value: '1234', key: 'password' }
                        }
                    ]);
                    done()
                })
        });
        it('should response with error when email already in use', function (done) {
            agent.post('/api/users')
                .field('email', 'test@example.com')
                .field('password', '123456')
                .field('token', 'token')
                .expect(422)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            "message": "The specified email address is already in use.",
                            "path": "email",
                            "type": "unique violation",
                            "value": "test@example.com"
                        }
                    ]);
                    done()
                })
        });
        it('should response with token when all data correct', function (done) {
            agent.post('/api/users')
                .field('email', 'testmail@example.com')
                .field('password', '123456')
                .field('token', 'token')
                .expect(200)
                .end((err, res) => {
                    expect(res.body.token.length).to.be.equal(139);
                    done()
                })
        });
        it('should save profile and icon when data is correct', function (done) {
            agent.post('/api/users')
                .field('name', config.projectName)
                .attach('avatar', config.icon)
                .field('email', config.testEmail)
                .field('password', '123456')
                .field('token', 'token')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body.token.length).to.be.equal(139);
                    db.User.find({
                        where:{
                            email: config.testEmail
                        }
                    }).then(user => {
                        avatarPath = user.dataValues.avatar;
                        expect(user.dataValues.name).to.be.equal(config.projectName);
                        expect(user.dataValues.email).to.be.equal(config.testEmail);
                        stat(path.join(Config.root, user.avatar),(err) =>{
                            expect(err).is.null;
                             done()
                        })
                    })
                    // done();
                })
        });
        after(function (done) {
            unlink(path.join(Config.root, avatarPath),(err) => {
                if(err)console.error(err);
                return done()
            })
        })
    })
});
