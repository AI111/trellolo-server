'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Rooms', [
          {
              _id: 1,
              name: "room1",
              creatorId:1,
              projectId:1,

          },{
              _id: 2,
              name: "room2",
              creatorId:1,
              projectId:1,

          },{
              _id: 3,
              name: "room3",
              creatorId:1,
              projectId:1,

          },{
              _id: 4,
              name: "room4",
              creatorId:1,
              projectId:1,

          },{
              _id: 5,
              name: "room5",
              creatorId:1,
              projectId:1,

          },{
              _id: 6,
              name: "room6",
              creatorId:1,
              projectId:1,

          },
      ], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Rooms', null, {});
  }
};
