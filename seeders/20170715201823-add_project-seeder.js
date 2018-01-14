'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Projects', [
            {
                _id:1,
                title: 'name',
                description: 'trollolo',
                icon: "uploads/pop.jpg",
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id:2,
                title: 'name2',
                description: 'trollolo2',
                icon: "uploads/pop.jpg",
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id:3,
                title: 'name3',
                description: 'trollolo3',
                icon: "uploads/pop.jpg",
                active: true,
                createdAt : new Date(),
                updatedAt : new Date()
            },
            {
                _id:4,
                title: 'name4',
                icon: "uploads/pop.jpg",
                description: 'trollolo4',
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
                    accessRights: 'admin',
                    createdAt : new Date(),
                    updatedAt : new Date()
                },{
                    projectId: 2,
                    userId: 1,
                    teamName: 'test',
                    accessRights: 'user',
                    createdAt : new Date(),
                    updatedAt : new Date()
                },{
                    projectId: 3,
                    userId: 1,
                    teamName: 'test',
                    accessRights: 'user',
                    createdAt : new Date(),
                    updatedAt : new Date()
                },{
                    projectId: 4,
                    userId: 1,
                    teamName: 'test',
                    accessRights: 'user',
                    createdAt : new Date(),
                    updatedAt : new Date()
                },
            ]))
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Teams', null, {})
            .then(() =>  queryInterface.bulkDelete('Projects', null, {}));
    }
};
