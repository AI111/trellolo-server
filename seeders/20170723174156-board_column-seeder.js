'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('BoardColumns', [
            {
                _id: 1,
                boardId: 1,
                title: "Column 1",
                position: 1,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id: 2,
                title: "Title 2",
                boardId: 1,
                position: 2,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id: 3,
                title: "Title 3",
                boardId: 1,
                position: 3,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id: 4,
                title: "Title 4",
                boardId: 1,
                position: 4,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id: 5,
                title: "Title 5",
                boardId: 1,
                position: 5,
                createdAt : new Date(),
                updatedAt : new Date()
            }
        ], {});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('BoardColumns', null, {});
    }
};
