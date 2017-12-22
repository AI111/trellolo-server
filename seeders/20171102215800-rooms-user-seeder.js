'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('UserToRooms', [
          {
              _id: 1,
              roomId: 1,
              userId: 1,
              accessRights: "user",

          }, {
              _id: 2,
              roomId: 2,
              userId: 1,
              accessRights: "user",

          }, {
              _id: 3,
              roomId: 3,
              userId: 1,
              accessRights: "user",

          }, {
              _id: 4,
              roomId: 4,
              userId: 1,
              accessRights: "user",

          }, {
              _id: 5,
              roomId: 3,
              userId: 2,
              accessRights: "user",

          },
      ], {});
  },

  down: function (queryInterface, Sequelize) {
          return queryInterface.bulkDelete('UserToRooms', null, {});
  }
};
