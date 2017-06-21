/**
 * Created by sasha on 6/22/17.
 */

import * as app from '../../../src/index';
import {db} from '../../../src/sqldb';
import * as request from 'supertest';
import {expect, use}  from "chai";
import * as chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);
const agent = request.agent(app.default);
describe('User API:', function() {
    var user;

    // Clear users before testing
    before(function() {
        return db.User.destroy({ where: {} }).then(function() {
            user = db.User.build({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password'
            });
            return user.save();
        });
    });

    // Clear users after testing
    after(function() {
        return db.User.destroy({ where: {} });
    });

    describe('GET /api/users/me', function() {
        var token;

        before(function(done) {
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

        it('should respond with a user profile when authenticated', function(done) {
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

        it('should respond with a 401 when not authenticated', function(done) {
            agent
                .get('/api/users/me')
                .expect(401)
                .end(done);
        });
    });
});
