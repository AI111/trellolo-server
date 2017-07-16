'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Projects', [
            {
                _id:1,
                title: 'name',
                description: 'trollolo',
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id:2,
                title: 'name2',
                description: 'trollolo2',
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            }
        ], {})
            .then(() => queryInterface.bulkInsert('Teams', [
                {
                    projectId: 1,
                    userId: 1,
                    teamName: 'test',
                    accessRights: 'creator',
                    createdAt : new Date(),
                    updatedAt : new Date()
                },
                {
                    projectId: 1,
                    userId: 2,
                    teamName: 'test',
                    accessRights: 'user',
                    createdAt : new Date(),
                    updatedAt : new Date()
                },
            ]))
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Projects', null, {})
            .then(() =>  queryInterface.bulkDelete('Projects', null, {}));
    }
};
