/**
 * Created by sasha on 6/22/17.
 */
import * as app from '../../../src/index';
import {db} from '../../../src/sqldb';
import * as request from 'supertest';
import {expect, use}  from "chai";
import {config} from "./test.config"
import {unlink} from "fs";
use(require('sinon-chai'));
use(require('chai-as-promised'));
use(require('chai-things'));

const agent = request.agent(app.default);
describe('Project API:', function() {
    var user , team, project;
    before(function () {
        return db.User.destroy({ where: {} }).then(function() {
            user = db.User.build({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password'
            });
            return user.save()
                .then(user => db.Project.create({
                    name: 'name',
                    icon:"icon",
                    description:'trollolo',
                    active: true
                }))
                .then(p => {
                    project = p;
                    db.Team.create({
                        project: p._id,
                        user: user._id,
                        teamName:'test'
                    })
                        .then(t=>{
                            team=t
                        })
                })
        });

    });
    after(function() {
        return db.Team.destroy({where: {}})
            .then(() => db.Project.destroy({ where: {}}))
            .then(() => db.User.destroy({ where: {}}))
    });

    describe('Check /api/projects', function () {
        var token;

        before(function(done) {
            // agent.get('/api/users')
            //     .expect('Content-Type', /json/)
            //     .end((err, res) => {
            //         console.log('project',res.body);
            //         // expect(res.body._id.toString()).to.equal(project._id.toString());
            //         done();
            //     });
            agent
                .post('/auth/local')
                .send({
                    email: 'test@example.com',
                    password: 'password'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                console.log('REASAADSASD',err, res.body);
                    token = res.body.token;
                    done();
                });
        });
        describe('Check GET /api/projects', function () {
            it('should return user user project list', function(done) {
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

            it('should respond with a 401 when not authenticated', function(done) {
                agent
                    .get('/api/projects')
                    .expect(401)
                    .end(done);
            });
        });
        describe('Check create new project POST /api/projects', function () {
            let testProject;
            before(function (done) {

                    agent.post('/api/projects')
                        .field('name', config.projectName)
                        .attach('icon', config.icon)
                        .set('authorization', `Bearer ${token}`)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            testProject = res.body;
                            done();
                        });
            });
            it('Check new Project in DB',  (done) => {
                db.Project.find({where:{name:config.projectName}})
                    .then(project => {
                        project.dataValues.createdAt = (project.dataValues.createdAt as Date).toISOString();
                        project.dataValues.updatedAt = (project.dataValues.updatedAt as Date).toISOString();
                        expect(project.dataValues).to.deep.include(testProject);
                        done();
                    })
            });
            it('Should return error without required field name', (done)=>{
                agent.post('/api/projects')
                    .set('authorization', `Bearer ${token}`)
                    .expect(500)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        expect(res.body.errors[0].message).to.be.equal('name cannot be null');
                        done();
                    });
            });
            it('should respond with a 401 when not authenticated', function(done) {
                agent
                    .get('/api/projects')
                    .expect(401)
                    .end(done);
            });
            after( (done) => {
                unlink(testProject.icon,(err) => {
                    if(err)console.error(err);
                   return done()
                })
            })
        })
    });

});
