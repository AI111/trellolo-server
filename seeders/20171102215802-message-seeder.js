'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      const timestamp = new  Date();
      const messages = Array.from(Array(200).keys()).map((index) => ({
          _id: index,
          roomId: 1,
          message: `test message ${index}`,
          userId: 1,
          createdAt: (new Date(timestamp.getTime() + 5000 * index)),
          updatedAt: (new Date(timestamp.getTime() + 5000 * index)),
      }));
      return queryInterface.bulkInsert('Messages', messages, {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Messages', null, {});
  }
};
