import {expect, use} from "chai";
import {spy, stub} from "sinon";
import * as builder from "../../src/common/query.builder";
import {Request} from "../../src/models/IExpress";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));

describe("Query builder service", function() {
    it("typeParser should parse query value", () => {
        expect(builder.typeParser("$like", "%%%s%", "sasha")).to.be.deep.equal({$like: "%sasha%"});
        expect(builder.typeParser("$like", "%%%s", "sasha")).to.be.deep.equal({$like: "%sasha"});
        expect(builder.typeParser("$like", "%s%", "sasha")).to.be.deep.equal({$like: "sasha%"});
    });
    it("buildQueryByParams should build query for simple params", () => {
        const typeParserStub =  stub(builder, "typeParser");

        const where = {
            _id: 1,
            attributes: ["_id", "name"],
        };
        const query = {
                name: "sasha",
                email: "sadfsdf",
        };
        expect(builder.buildQueryByParams(where, query, ["name"])).to.be.deep.equal({
            _id: 1,
            attributes: ["_id", "name"],
            name: "sasha",
        });
        expect(typeParserStub).to.not.been.called;
        typeParserStub.restore();
    });
    it("buildQueryByParams should build query composite params", () => {
        const typeParserStub =  stub(builder, "typeParser");
        typeParserStub.withArgs("%like%", "sasha").returns({$like: "%sasha%"});
        typeParserStub.withArgs("like%", "email1").returns({$like: "email1%"});

        const query = {
            _id: 1,
            attributes: ["_id", "name"],
        };
        const request = {
                name: "sasha",
                email: "email1",
                city: "Odessa",
        };
        expect(builder.buildQueryByParams( query, request, [
            {name: "name", type: "$like", format: "%%%s%"},
            {name: "email", type: "$like", format: "%s%"},
        ])).to.be.deep.equal({
            _id: 1,
            attributes: ["_id", "name"],
            email: {
                $like: "email1%",
            },
            name: {
                $like: "%sasha%",
            },
        });
        // expect(typeParserStub).to.not.been.called;
        typeParserStub.restore();
    });

});
