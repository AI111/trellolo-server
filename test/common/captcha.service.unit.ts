/**
 * Created by sasha on 6/26/17.
 */
import * as Promise from "bluebird";
import {expect, use}  from "chai";
import {spy, stub} from "sinon";
use(require("sinon-chai"));
import * as chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);
const proxyquire = require("proxyquire").noPreserveCache().noCallThru();
const requestSpec = {
    post: stub(),
};
const captchaService = proxyquire("../../src/common/captcha.service", {
    request: requestSpec,
});
describe("Captcha service", function() {

    it("should send request to google server", function() {
        requestSpec.post.callsFake((url: string, options: any, clb: (err, res, body) => void) => {
            clb(null, null, JSON.stringify({success: "true"}));
        });
        return expect(captchaService.captureServiceInstance.verifyCaptcha("123")).to.be.fulfilled;
    });
    it("should reject when token is not defined", function() {
        return expect(captchaService.captureServiceInstance.verifyCaptcha("")).to.be.rejectedWith("token is not defined");
    });
});
