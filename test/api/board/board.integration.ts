/**
 * Created by sasha on 7/12/17.
 */
import * as app from '../../../src/index';
import {db} from '../../../src/sqldb';
import {agent, SuperTest, Test} from 'supertest';
import {expect, use}  from "chai";
import {cleadDBData, config, createTestProjectUser, getToken} from "../../test.config"
import {Config} from "../../../src/config/environment"
import {unlink, stat} from "fs";
import * as path from "path";
import {ProjectAccessRights} from "../../../src/models/team/ITeam";
import {token} from "morgan";
use(require('sinon-chai'));
use(require('chai-as-promised'));
use(require('chai-things'));

const httpAgent: SuperTest<Test> = agent(app.default);
describe('Board API:', function() {
    var user, tokenValid, tokenInvalid,   project;
    describe('GET /api/projects/{projectId}/boards',function () {
        before(function () {
            return createTestProjectUser()
                .then(() => getToken(httpAgent,'test@example.com','password'))
                .then(token => tokenValid = token)
                .then(() => getToken(httpAgent,'test2@example.com','password'))
                .then(token => tokenInvalid = token)
        });
        after(function () {
            return cleadDBData()
        });
        it('should respond with a 401 when not authenticated', function (done) {
            httpAgent
                .get(`/api/projects/${1}/boards`)
                .expect(401)
                .end(done);
        });
        it('should respond with a 403 when user not have access to edit project', function (done) {
            httpAgent
                .get(`/api/projects/${1}/boards`)
                .set('authorization', `Bearer ${tokenInvalid}`)
                .expect(403)
                .end((err,res)=>{
                    expect(res.body).to.be.deep.equal({"message":"Forbidden"});
                    done()
                });
        });
        // it('should return list of user projects', function (done) {
        //     httpAgent
        //         .get(`/api/projects/${1}/boards`)
        //         .set('authorization', `Bearer ${tokenValid}`)
        //         .expect(200)
        //         .end((err,res)=>{
        //             expect(res.body).to.deep.include([
        //                 { _id: 1,
        //                     name: 'board 1',
        //                     projectId: 1,
        //                     description: 'description 1',
        //                     info: null,
        //                     active: null,
        //                     boardId: null},
        //                 { _id: 2,
        //                     name: 'board 2',
        //                     projectId: 2,
        //                     description: 'description 2',
        //                     info: null,
        //                     active: null,
        //                     boardId: null
        //                 }
        //                 ]);
        //             done()
        //         });
        // });


    })
});