/**
 * Created by sasha on 6/26/17.
 */
import * as Promise from "bluebird";
import {expect, use}  from "chai";
import {spy,stub} from 'sinon'
use(require('sinon-chai'));
use(require('chai-as-promised'));
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const requestSpec = {
    post:stub()
};
const captchaService = proxyquire('../../src/common/captcha.service',{
    "request":requestSpec
});
// describe('Captcha service', function () {
//     it('should send request to google server',(done) => {
//         requestSpec.post.callsFake(() => Promise.resolve());
//         expect(captchaService.captureServiceInstance.verifyCaptcha("123")).to.be.fulfilled.and.notify(done);
//     })
// })