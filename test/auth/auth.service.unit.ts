import {req, res} from "../test.config";
/**
 * Created by sasha on 6/24/17.
 */
// import * as authService from '../../src/auth/auth.service'
const compose = require("composable-middleware");
import * as async from "async";
import {expect, use}  from "chai";
import {spy, stub} from "sinon";

use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
import * as Promise from "bluebird";
import {log} from "util";

const proxyquire = require("proxyquire").noPreserveCache().noCallThru();

const jsonwebtokenSpec = {
    sign: stub(),
};
const dbSpec = {
    User: {
        find: stub(),
    },
};
const expressJwtSpec = stub();
const authService = proxyquire("../../src/auth/auth.service", {
    "jsonwebtoken": jsonwebtokenSpec,
    "../sqldb/index": dbSpec,
    "express-jwt": () => expressJwtSpec,
});
describe("Auth Service middleware:", function() {
    describe("check setTokenCookie", function() {
        it("It should not work with unauthorized request", function(){
            const res = {
                status: stub(),
                send: spy(),
            }, req = {};
            res.status.returns(res);
            authService.setTokenCookie(req, res);
            expect(res.status).to.have.been.calledWith(404);
            expect(res.send).to.have.been.calledWith("It looks like you aren\'t logged in, please try again.");
        });
        it("It should set cookies when request is authorized", function(){
            const res = {
                cookie: spy(),
                redirect: spy(),
            };
            const req = {
                user: {},
            };
            jsonwebtokenSpec.sign.returns("test-token");
            authService.setTokenCookie(req, res);
            expect(res.cookie).to.have.been.calledWith("token", "test-token");
            expect(res.redirect).to.have.been.calledWith("/");
        });
    });
    describe("check hasRole", function() {
        it("It should check if role exist ", function() {
            expect(authService.hasRole).to.throw(Error, "Required role needs to be set");
        });
        // it('It should send 401 if role lower then required', function (done) {
        //
        //    let isAuthStub = stub(authService, 'isAuthenticated').callsFake(function() {
        //        return compose()
        //            .use(function (req, res, next) {
        //                console.log('asdsad');
        //                next();
        //            });
        //    });
        //    let next= spy();
        //    res.status.returns(res);
        //   let r =  authService.hasRole('guest');
        //    expect(isAuthStub).to.be.calledOnce;
        //    expect(res.status).to.be.calledWith(403);
        //    expect(res.send).to.be.calledWith('Forbidden');
        //    done()
        //
        // });
    });
    // describe('check isAuthenticated',function () {
    //     it('it should authenticate user and append instance in request ',function (done) {
    //         expressJwtSpec.callsFake((req,res,next)=>{
    //             req.user={_id:111};
    //             console.log('expressJwtSpec');
    //             next()
    //         });
    //         dbSpec.User.find.callsFake(()=>{
    //             return Promise.resolve({_id:2222})
    //         });
    //
    //         let next= spy();
    //         let req ={};
    //         let res ={};
    //
    //                 authService.isAuthenticated()(req,res,next);
    //                 expect(expressJwtSpec).to.have.been.calledWith(req,res,next)
    //                 expect(true).to.be.equal(false);
    //
    //
    //
    //     })
    // })
});
