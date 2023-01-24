'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'Spots';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Disney Way',
        city: 'Magic Kingdom',
        state: 'California',
        country: 'USA',
        lat: 34.05,
        lng: 118.24,
        name: 'Disneyland',
        description: 'The happiest place on Earth',
        price: 420.69
      },
      {
        ownerId: 2,
        address: '123 Magic Mtn Pkwy',
        city: 'Hell',
        state: 'California',
        country: 'USA',
        lat: 34.05,
        lng: 118.24,
        name: 'Tragic Mountain',
        description: 'The scariest place on Earth',
        price: 69.42
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options);
  }
};
