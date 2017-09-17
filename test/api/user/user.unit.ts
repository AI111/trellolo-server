// /**
//  * Created by sasha on 6/22/17.
//  */
"use strict";
import {expect, use}  from "chai";
import {spy} from "sinon";
const proxyquire = require("proxyquire").noPreserveCache();
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));
import {Model} from "sequelize";
import {BaseController} from "../../../src/common/base.controller";
import {IUserAttributes, IUserInstance} from "../../../src/models/user/IUser";

//
// var userCtrlStub = {
//     index: 'userCtrl.index',
//     destroy: 'userCtrl.destroy',
//     me: 'userCtrl.me',
//     changePassword: 'userCtrl.changePassword',
//     show: 'userCtrl.show',
//     create: 'userCtrl.create'
// };
//
// var authServiceStub = {
//     isAuthenticated() {
//         return 'authService.isAuthenticated';
//     },
//     hasRole(role) {
//         return `authService.hasRole.${role}`;
//     }
// };
//
// var routerStub = {
//     get: spy(),
//     put: spy(),
//     post: spy(),
//     delete: spy()
// };
//
// // require the index with our stubbed out modules
// var userIndex = proxyquire('../../../src/api/user/index', {
//     express: {
//         Router() {
//             return routerStub;
//         }
//     },
//     './user.controller': userCtrlStub,
//     '../../auth/auth.service': authServiceStub
// });
//
// describe('User API Router:', function() {
//     it('should return an express router instance', function() {
//         expect(userIndex).to.equal(routerStub);
//     });
//
//     describe('GET /api/users', function() {
//         it('should verify admin role and route to user.controller.index', function() {
//             expect(routerStub.get
//                 .withArgs('/', 'authService.hasRole.admin', 'userCtrl.index')
//             ).to.have.been.calledOnce;
//         });
//     });
//
//     describe('DELETE /api/users/:id', function() {
//         it('should verify admin role and route to user.controller.destroy', function() {
//             expect(routerStub.delete
//                 .withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy')
//             ).to.have.been.calledOnce;
//         });
//     });
//
//     describe('GET /api/users/me', function() {
//         it('should be authenticated and route to user.controller.me', function() {
//             expect(routerStub.get
//                 .withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me')
//             ).to.have.been.calledOnce;
//         });
//     });
//
//     describe('PUT /api/users/:id/password', function() {
//         it('should be authenticated and route to user.controller.changePassword', function() {
//             expect(routerStub.put
//                 .withArgs('/:id/password', 'authService.isAuthenticated', 'userCtrl.changePassword')
//             ).to.have.been.calledOnce;
//         });
//     });
//
//     describe('GET /api/users/:id', function() {
//         it('should be authenticated and route to user.controller.show', function() {
//             expect(routerStub.get
//                 .withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.show')
//             ).to.have.been.calledOnce;
//         });
//     });
//
//     describe('POST /api/users', function() {
//         it('should route to user.controller.create', function() {
//             expect(routerStub.post
//                 .withArgs('/', 'userCtrl.create')
//             ).to.have.been.calledOnce;
//         });
//     });
// });
