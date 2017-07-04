/**
 * Created by sasha on 7/4/17.
 */
import {expect, use}  from "chai";
import {spy,stub} from 'sinon'
import {res,req} from '../../test.config'
import * as Promise from "bluebird"
import {db} from "../../../src/sqldb/index";
use(require('sinon-chai'));
use(require('chai-as-promised'));
use(require('chai-things'));
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

describe("Check User model instance methods",function () {
    describe("Check makeSalt", function () {
        it("It should return promise ",function () {
            let user = db.User()
        })
    })

})