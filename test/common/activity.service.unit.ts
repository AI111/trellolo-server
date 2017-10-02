import {req} from "../test.config";

const Sequilize = require("sequelize");

import {expect, use} from "chai";
import {Promise} from "sequelize";
import {spy, stub} from "sinon";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));

// const proxyquire = require("proxyquire");
const proxyquire = require("proxyquire").noPreserveCache().noCallThru();
const activityStub = {
    create: stub(),
};
const jsonStub = {
    compare: stub(),
};

const activityService = proxyquire("../../src/common/activity.service", {
    "../sqldb": {
        db: {
            Activity: activityStub,
        },
    },
    "fast-json-patch": jsonStub,
});
describe("Check activity.service.model", function() {
    describe("check function logActivity", () => {
        it("should return function for logging", () => {
            const entity = {
                _modelOptions: {
                    name: {
                        plural: "test",
                    },
                },
                _id: 5,
            };
            activityStub.create.returns(Promise.resolve());
            expect(activityService.logActivity(req, 1)(entity)).to.be.fulfilled;
            expect(activityStub.create).to.be.calledWith({
                userId: 777,
                messageId: 1,
                projectId: undefined,
                table: "test",
                tableId: 5,
            });
            activityStub.create.reset();
        });
    });
    describe("check function normalizeObject", () => {
        it("should object without Date objects", () => {
            const obj = {
                date: new Date("Sun, 24 Sep 2017 19:42:14 GMT"),
                text: "test field",
                number: 1,
                boolean: true,
            };
            expect(activityService.normalizeObject(obj)).to.be.deep.equal({
                date: "Sun, 24 Sep 2017 19:42:14 GMT" ,
                text: "test field",
                number: 1,
                boolean: true,
            });
        });
    });
    describe("check function saveActivity", () => {
        it("should return function for logging", () => {
            const entity = {
                _modelOptions: {
                    name: {
                        plural: "test",
                    },
                },
                _id: 5,
                dataValues: {
                    name: 1,
                },
            };
            const normalizeStub = stub(activityService, "normalizeObject").callsFake((obj) => obj);
            activityStub.create.returns(Promise.resolve());
            jsonStub.compare.returns("test diff");
            expect(activityService.saveActivity(req, 1, entity, entity.dataValues)).to.be.fulfilled;
            expect(activityStub.create).to.be.calledWith({
                userId: 777,
                messageId: 1,
                projectId: undefined,
                table: "test",
                tableId: 5,
                diff: "test diff",
            });
            expect(jsonStub.compare).to.be.calledWith()
            activityStub.create.reset();
            normalizeStub.restore();
        });
    });

});
