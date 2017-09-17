'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Activitys', [
          {
              _id: 1,
              message: "Create new Column",
          },{
              _id: 2,
              message: "Update Column",
          },{
              _id: 3,
              message: "Delete Column",
          },{
              _id: 4,
              message: "Create new Card",
          },{
              _id: 5,
              message: "Update Card",
          },{
              _id: 6,
              message: "Delete Card",
          },
      ], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Activitys', null, {});

  }
};
