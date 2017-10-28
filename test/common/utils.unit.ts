import {req} from "../test.config";

const Sequilize = require("sequelize");

import {expect, use} from "chai";
import {Promise} from "sequelize";
import {spy, stub} from "sinon";
import {flattenDeep, values} from "lodash";

use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));

// const proxyquire = require("proxyquire");
const proxyquire = require("proxyquire").noPreserveCache().noCallThru();
const activityStub = {
    create: stub(),
};
const fs = {
    unlink: stub(),
};

const utils = proxyquire("../../src/common/utils", {
    "../sqldb": {
        db: {
            Activity: activityStub,
        },
    },
    fs,
});
describe("Check utils functions", function() {
    describe("check function deleteFiles", () => {
        it("should delete files by Multer.Files ", () => {
            const files: Express.Multer.File = {path: "qqq"} as Express.Multer.File;
            fs.unlink.returns(() => Promise.resolve())
            expect(utils.deleteFiles(files)).to.be.fulfilled
            expect(fs.unlink).to.have.been.calledWith("qqq");
            expect(fs.unlink).to.have.been.calledOnce;
            fs.unlink.reset();
        });
        it("should delete files by Multer.Files Array", () => {
            const files: Express.Multer.File[] = [
                {path: "qqq"},
                {path: "222"},
                ] as Express.Multer.File[];
            fs.unlink.returns(() => Promise.resolve())
            expect(utils.deleteFiles(files)).to.be.fulfilled;
            expect(fs.unlink).to.have.been.calledWith("qqq");
            expect(fs.unlink).to.have.been.calledWith("222");
            expect(fs.unlink).to.have.been.callCount(files.length);
            fs.unlink.reset();
        });
        it("should delete files by string Array", () => {
            const files = ["a", "b", "c"];
            fs.unlink.returns(() => Promise.resolve())
            expect(utils.deleteFiles(files)).to.be.fulfilled
            files.forEach((f) => {
                expect(fs.unlink).to.have.been.calledWith(f);
            })
            expect(fs.unlink).to.have.been.callCount(files.length);
            fs.unlink.reset();
        });
        it("should delete file by string ", () => {
            const file = "qwerty";
            fs.unlink.returns(() => Promise.resolve())
            expect(utils.deleteFiles(file)).to.be.fulfilled
            expect(fs.unlink).to.have.been.calledWith(file);
            expect(fs.unlink).to.have.been.calledOnce;
            fs.unlink.reset();
        });
    });
});