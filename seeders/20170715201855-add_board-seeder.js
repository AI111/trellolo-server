'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Boards', [
            {
                _id:1,
                name: 'name',
                description: 'trollolo',
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id:2,
                name: 'name2',
                description: 'trollolo2',
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id:3,
                name: 'name3',
                description: 'trollolo3',
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            }
        ], {})
            .then(() => queryInterface.bulkInsert('BoardToUsers', [
                {
                    boardId: 1,
                    userId: 1,
                    createdAt : new Date(),
                    updatedAt : new Date()
                },
                {
                    boardId: 2,
                    userId: 1,
                    createdAt : new Date(),
                    updatedAt : new Date()
                },
                {
                    boardId: 3,
                    userId: 2,
                    createdAt : new Date(),
                    updatedAt : new Date()
                },
            ]))
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Boards', null, {})
            .then(() =>  queryInterface.bulkDelete('BoardToUsers', null, {}));
    }
};
