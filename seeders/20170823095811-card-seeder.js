'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Cards', [
          {
              // _id: 1,
              title: "test title",
              position: 1,
              userId: 1,
              boardId: 1,
              columnId: 1,
              createdAt : new Date(),
              updatedAt : new Date()
          },{
              // _id: 2,
              title: "test title",
              position: 2,
              userId: 1,
              boardId: 1,
              columnId: 1,
              createdAt : new Date(),
              updatedAt : new Date()
          },{
              // _id: 3,
              title: "test title",
              position: 3,
              userId: 1,
              boardId: 1,
              columnId: 1,
              createdAt : new Date(),
              updatedAt : new Date()
          },{
              // _id: 4,
              title: "test title",
              position: 4,
              userId: 1,
              boardId: 1,
              columnId: 1,
              createdAt : new Date(),
              updatedAt : new Date()
          }, {
              // _id: 5,
              title: "test title",
              position: 1,
              userId: 1,
              boardId: 1,
              columnId: 3,
              createdAt : new Date(),
              updatedAt : new Date()
          },{
              // _id: 6,
              title: "test title",
              position: 2,
              userId: 1,
              boardId: 1,
              columnId: 3,
              createdAt : new Date(),
              updatedAt : new Date()
          },{
              // _id: 7,
              title: "test title",
              position: 3,
              userId: 1,
              boardId: 1,
              columnId: 3,
              createdAt : new Date(),
              updatedAt : new Date()
          },{
              // _id: 8,
              title: "test title",
              position: 4,
              userId: 1,
              boardId: 1,
              columnId: 3,
              createdAt : new Date(),
              updatedAt : new Date()
          },
      ], {});

  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Cards', null, {});
  }
};
