/**
 * Created by sasha on 7/8/17.
 */
const Sequilize = require("sequelize");

import {expect, use} from "chai";
import {Promise} from "sequelize";
import {spy, stub} from "sinon";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));

const proxyquire = require("proxyquire").noCallThru();
class ModelStub {
    public static update = stub();
    public static init = stub();
}
const literalStub = stub();

const cardCtrl = proxyquire("../../../src/api/card/card.model", {
    sequelize: {
        Model: ModelStub,
        literal: literalStub,
    },
});
describe("Check card.model", function() {
    it("Card updateCard remove card from column", () =>  {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        ModelStub.update.returns(Promise.resolve(card));
        literalStub.callsFake(str => str);
        card.position = 1;
        card.columnId = 1;
        card.boardId = 2
        expect(card.updateCard(2)).to.be.fulfilled;
        expect(ModelStub.update).to.be.calledWith(
            {
                position:  `position -1`,
            },
            {
                where: {
                    boardId: 2,
                    columnId: 1,
                    position: {
                        $gte: 1,
                    },
                },
            });
    });
    it("Card updateCard add to column ", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        ModelStub.update.returns(Promise.resolve(card));
        literalStub.callsFake(str => str);
        card.position = 1;
        card.columnId = 1;
        card.boardId = 2
        expect(card.updateCard(2, 3)).to.be.fulfilled;
        expect(ModelStub.update).to.be.calledWith(
            {
                position:  `position +1`,
            },
            {
                where: {
                    boardId: 2,
                    columnId: 2,
                    position: {
                        $gte: 3,
                    },
                },
            });
    });
    it("Card updateCard update positions in same column", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        ModelStub.update.returns(Promise.resolve(card));
        literalStub.callsFake(str => str);
        card.position = 3;
        card.columnId = 1;
        card.boardId = 2;
        expect(card.updateCard(1, 6)).to.be.fulfilled;
        expect(ModelStub.update).to.be.calledWith(
            {
                position:  `position -1`,
            },
            {
                where: {
                    boardId: 2,
                    columnId: 1,
                    position: {
                        $between: [3, 6],
                    },
                },
            });
    });
});
