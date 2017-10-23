/**
 * Created by sasha on 7/8/17.
 */
const Sequilize = require("sequelize");
import {expect, use} from "chai";
import {Op, Promise} from "sequelize";
import {spy, stub} from "sinon";
use(require("sinon-chai"));
use(require("chai-as-promised"));
use(require("chai-things"));

const proxyquire = require("proxyquire");
// const proxyquire = require("proxyquire").noPreserveCache().noCallThru();
class ModelStub {
    public static update = stub();
    public static init = stub();
    public static belongsTo = spy();
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
        literalStub.callsFake((str) => str);
        card.position = 1;
        card.columnId = 1;
        card.boardId = 2;
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
                transaction: undefined,
            });
    });
    it("Card updateCard add to column ", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        ModelStub.update.returns(Promise.resolve(card));
        literalStub.callsFake((str) => str);
        card.position = 1;
        card.columnId = 1;
        card.boardId = 2;
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
                transaction: undefined,
            });
    });
    it("Card updateCard update positions in same column down", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        ModelStub.update.returns(Promise.resolve(card));
        literalStub.callsFake((str) => str);
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
                transaction: undefined,
            });
    });
    it("Card updateCard update positions in same column up", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        ModelStub.update.returns(Promise.resolve(card));
        literalStub.callsFake((str) => str);
        card.position = 7;
        card.columnId = 1;
        card.boardId = 2;
        expect(card.updateCard(1, 3)).to.be.fulfilled;
        expect(ModelStub.update).to.be.calledWith(
            {
                position:  `position +1`,
            },
            {
                where: {
                    boardId: 2,
                    columnId: 1,
                    position: {
                        $between: [3, 7],
                    },
                },
                transaction: undefined,
            });
    });
    it("Card moveTo change card position in same column", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        const updateCardStub = stub(card, "updateCard");
        updateCardStub.returns(Promise.resolve());
        card.position = 7;
        card.columnId = 1;
        card.boardId = 2;
        expect(card.updateCard(1, 3)).to.be.fulfilled;
        expect(updateCardStub).to.be.calledWith(1, 3);
        updateCardStub.restore();
    });
    it("Card moveTo change card position in different columns", () => {
        ModelStub.update.reset();
        const card: any = new cardCtrl.Card();
        const updateCardStub = stub(card, "updateCard");
        updateCardStub.returns(Promise.resolve());
        card.position = 7;
        card.columnId = 1;
        card.boardId = 2;
        expect(card.updateCard(2, 3)).to.be.fulfilled;
        expect(updateCardStub).to.be.calledWith(2);
        expect(updateCardStub).to.be.calledWith(2, 3);
        updateCardStub.restore();
    });
});
