'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('Invites', [
          {
              _id: 1,
              projectId: 1,
              userFromId: 1,
              userToId: 3,
              message: "team invite",
              createdAt : new Date(),
              updatedAt : new Date()
          }, {
              _id: 2,
              projectId: 1,
              userFromId: 1,
              userToId: 3,
              message: "team invite",
              createdAt : new Date(),
              updatedAt : new Date()
          }, {
              _id: 3,
              projectId: 2,
              userFromId: 2,
              userToId: 3,
              message: "team invite",
              createdAt : new Date(),
              updatedAt : new Date()
          },
      ], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Invites', null, {});
  }
};
