'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'Bookings';

module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2022-12-1',
        endDate: '2023-1-1'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2022-12-1',
        endDate: '2023-1-1'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
