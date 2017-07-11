/**
 * Created by sasha on 6/22/17.
 */
import * as app from '../../../src/index';
import {db} from '../../../src/sqldb';
import * as request from 'supertest';
import {expect, use}  from "chai";
import {config} from "../../test.config"
import {Config} from "../../../src/config/environment"
import {unlink, stat} from "fs";
import * as path from "path";
use(require('sinon-chai'));
use(require('chai-as-promised'));
use(require('chai-things'));

const agent = request.agent(app.default);
describe('Project API:', function() {
    var user, team, project;
    before(function () {
        return db.User.destroy({where: {}}).then(function () {
            user = db.User.build({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password'
            });
            return user.save()
                .then(user => db.Project.create({
                    title: 'name',
                    icon: "icon",
                    description: 'trollolo',
                    active: true
                }))
                .then(p => {
                    project = p;
                    db.Team.create({
                        projectId: p._id,
                        userId: user._id,
                        teamName: 'test'
                    })
                        .then(t => {
                            team = t;
                            return t;
                        })
                })
        });

    });
    after(function () {
        return db.Team.destroy({where: {}})
            .then(() => db.Project.destroy({where: {}}))
            .then(() => db.User.destroy({where: {}}))
            .then(() => db.Team.destroy({where: {}}))
    });

    describe('GET /api/projects', function () {
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
        describe('Check GET /api/projects', function () {
            it('should return user user project list', function (done) {
                agent
                    .get('/api/projects')
                    .set('authorization', `Bearer ${token}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        project.dataValues.createdAt = (project.dataValues.createdAt as Date).toISOString();
                        project.dataValues.updatedAt = (project.dataValues.updatedAt as Date).toISOString();
                        expect(res.body[0]).to.deep.include(project.dataValues);
                        done();
                    });
            });

            it('should respond with a 401 when not authenticated', function (done) {
                agent
                    .get('/api/projects')
                    .expect(401)
                    .end(done);
            });
        });
    });
    describe('POST /api/projects', function () {
        let testProject, token;
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
                    agent.post('/api/projects')
                        .field('title', config.projectName)
                        .attach('icon', config.icon)
                        .set('authorization', `Bearer ${token}`)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            testProject = res.body;
                            done();
                        });
                });

        });
        it('Check new Project in DB', (done) => {
            db.Project.find({where: {title: config.projectName}})
                .then(project => {
                    project.dataValues.createdAt = (project.dataValues.createdAt as Date).toISOString();
                    project.dataValues.updatedAt = (project.dataValues.updatedAt as Date).toISOString();
                    expect(project.dataValues).to.deep.include(testProject);
                    done();
                })
        });
        it('Should return error without required field name', (done) => {
            agent.post('/api/projects')
                .set('authorization', `Bearer ${token}`)
                .expect(500)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.be.deep.equal([
                        {
                            "message": "",
                            "path": "title",
                            "type": "notNull Violation",
                            "value": null
                        }
                    ]);
                    done();
                });
        });
        it('should respond with a 401 when not authenticated', function (done) {
            agent
                .get('/api/projects')
                .expect(401)
                .end(done);
        });
        it('should save img file', function (done) {
            db.Project.findById(testProject._id)
                .then(project => {
                    stat(path.join(Config.root, project.dataValues.icon), (err) => {
                        expect(err).is.null;
                        return done()
                    })
                })
        });
        after((done) => {
            unlink(testProject.icon, (err) => {
                if (err) console.error(err);
                return done()
            })
        })
    });
    describe('PUT /api/projects', function () {
        let project, token;
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
                     db.Project.create({
                        title: 'updated test project',
                        icon: "icon1",
                        description: 'trollolo test',
                        active: true
                    })
                        .then(p => {
                            project = p;
                            return db.Team.create({
                                projectId: p._id,
                                userId: user._id,
                                teamName: 'test'
                            })
                        })
                         .then(() => done());
                })


        });
        it('should respond with a 401 when not authenticated', function (done) {
            agent
                .put('/api/projects/1')
                .expect(401)
                .end(done);
        });
        // it('should change only title',function (done) {
        //     agent
        //         .put(`/api/projects/${project._id}`)
        //         .set('authorization', `Bearer ${token}`)
        //         .field('title','updated project')
        //         .end((err,res) => {
        //             console.log('++++++++++++++++++',err,res.body);
        //             // return done()
        //            return db.Project.findById(project._id)
        //                 .then(pr => {
        //                     console.log('**********************',pr.dataValues);
        //                     expect(pr.dataValues.title).to.be.equal('updated project');
        //                     expect(pr.dataValues.icon).to.be.equal('icon1');
        //                     expect(pr.dataValues.description).to.be.equal('trollolo test');
        //                   return  done();
        //                 })
        //         });
        // })


    });
})