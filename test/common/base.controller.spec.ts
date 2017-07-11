import {BaseController} from "../../src/common/base.controller";
/**
 * Created by sasha on 7/4/17.
 */
import {expect, use}  from "chai";
import {spy,stub} from 'sinon'
import * as Sequelize from "sequelize";
import {IUserAttributes, IUserInstance} from "../../src/models/user/IUser";
import {res,req} from '../test.config'
import {ServerError} from "../../src/models/IError";
use(require('sinon-chai'));
use(require('chai-as-promised'));
use(require('chai-things'));
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

let jsonSpec: any ={
    default:{
        apply:stub()
    }
};
const bCtrl = proxyquire('../../src/common/base.controller',{
    "fast-json-patch":jsonSpec
});

describe('Base controller class:', function() {
    let modelStub: any ={
        destroy:stub(),
        save: stub(),
        findAll:stub(),
        create:stub()
    };
    beforeEach(function(){

    })
    describe('Check respondWithResult', function () {
        it('It should return null if entity empty',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            expect(cntrl['respondWithResult'](res as any)(null)).to.be.null
        });
        it('It should return express response if entity not empty',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = {"data":"test"};
            res.status.returns(res);
            res.json.returns(data);
            expect(cntrl['respondWithResult'](res as any)(data)).to.be.equal(data);
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(data)
        })
    });
    describe('Check validationError', function () {
        it('It should return express response with status 422 and error message',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = {"error":"test"};
            res.status.returns(res);
            res.json.returns(data);
            expect(cntrl['validationError'](res as any)(data)).to.be.equal(data);
            expect(res.status).to.have.been.calledWith(422);
            expect(res.json).to.have.been.calledWith(data)
        })    ;
        it('It should return express response with selected status and error message',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = {"error":"test"};
            res.status.returns(res);
            res.json.returns(data);
            expect(cntrl['validationError'](res as any,500)(data)).to.be.equal(data);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith(data)
        })
    });
    describe('Check handleError', function () {
        it('It should return express response with status 502 and error message',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = new ServerError("my err",502);
            res.status.returns(res);
            res.send.returns(data.error);
            expect(cntrl['handleError'](res as any)(data)).to.be.equal(data.error);
            expect(res.status).to.have.been.calledWith(502);
            expect(res.send).to.have.been.calledWith(data.error)
        });
        it('It should return express response with status 422 and error message',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = {"error":"test"};
            res.status.returns(res);
            res.send.returns(data);
            expect(cntrl['handleError'](res as any)(data)).to.be.equal(data);
            expect(res.status).to.have.been.calledWith(500);
            expect(res.send).to.have.been.calledWith(data)
        });
        it('It should return express response with selected status and error message',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = {"error":"test"};
            res.status.returns(res);
            res.send.returns(data);
            expect(cntrl['handleError'](res as any,777)(data)).to.be.equal(data);
            expect(res.status).to.have.been.calledWith(777);
            expect(res.send).to.have.been.calledWith(data);
        })
    });
    describe('Check handleEntityNotFound',function () {
        it('It should return express response status 404 if entity empty',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            res.status.returns(res);
            cntrl['handleEntityNotFound'](res as any)(null);
            expect(res.status).to.have.been.calledWith(404);
            expect(res.end).to.have.been.calledOnce;
        });
        it('It should return entity if it not empty',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            const data = {"data":"test"};
            expect(cntrl['handleEntityNotFound'](res as any)(data)).to.be.equal(data);
        });

    });
    describe('Check removeEntity', function () {
        it('It should return destroy of model', function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub as any);
            // res.status.restore;
            res.status.returns(res);
            modelStub.destroy.returns(Sequelize.Promise.resolve());
            expect(cntrl['removeEntity'](res as any)(modelStub)).to.be.fulfilled;
            expect(modelStub.destroy).to.have.been.calledOnce;
            expect(res.end).to.have.been.calledOnce;
        })
    });
    describe('Check patchUpdates', function () {
        it('It should return Sequelize.Promise reject if json apply failed',function () {
            let ctrl: any = new bCtrl.BaseController(modelStub);
            const data = {"data":"test"};
            const path = {"data":"test"};
            jsonSpec.default.apply.callsFake(() => {throw new Error('test')});
            expect(ctrl['patchUpdates'](path)(data)).to.be.rejectedWith(Error,'test')
        });
        it('It should return Sequelize.Promise resolve if json apply success',function () {
            let ctrl: any = new bCtrl.BaseController(modelStub);
            const data = {"data":"test"};
            const path = {"data":"test"};
            jsonSpec.default.apply.callsFake(() => {});
            modelStub.save.returns(Sequelize.Promise.resolve());
            expect(ctrl['patchUpdates'](path)(modelStub)).to.be.fulfilled;
            expect(jsonSpec.default.apply).to.be.calledWith(modelStub,path,true);
            expect(modelStub.save).to.be.calledOnce;
        })
    });
    describe("Check index", function () {
        it('It should excec findAll',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub);
            const data = {"data":"test"};
            modelStub.findAll.returns(Sequelize.Promise.resolve());
            let respStub = stub(cntrl,'respondWithResult');
            respStub.returns(()=>Sequelize.Promise.resolve(data));
            expect(cntrl.index(req,res)).to.be.eventually.equal(data);
            expect(modelStub.findAll).to.be.calledOnce;
            expect(respStub).to.be.calledOnce;
        });
    });
    describe("Check create", function () {
        it('It should exec findAll',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub);
            const data = {"data":"test"};
            modelStub.create.returns(Sequelize.Promise.resolve());
            let respStub = stub(cntrl,'respondWithResult');
            respStub.returns(()=>Sequelize.Promise.resolve(data));
            expect(cntrl.create(req,res)).to.be.eventually.equal(data);
            expect(modelStub.create).to.be.calledOnce;
            expect(respStub).to.be.calledOnce;
        });
        it('It should handler validation error',function () {
            let cntrl = new BaseController<Sequelize.Model<IUserInstance, IUserAttributes>>(modelStub);
            modelStub.create.callsFake(()=>Sequelize.Promise.reject(new Error('Validation Error')));
            let clb= spy();
            stub(cntrl,'handleError').callsFake(e=>e);
            stub(cntrl,'respondWithResult').callsFake(()=>clb);
            expect(cntrl.create(req,res)).to.be.rejectedWith(Error,'Validation Error');
            expect(modelStub.create).to.be.calledWith(req.body);
            expect(clb).to.not.been.called;
        });
    })
})