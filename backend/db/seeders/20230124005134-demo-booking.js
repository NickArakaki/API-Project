'use strict';
const { seedBookings } = require('../../utils/faker-seed');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Bookings';

module.exports = {
  async up (queryInterface, Sequelize) {
    // const bookings = seedBookings(50);
    const bookings = [
      {
        spotId: 1,
        userId: 50,
        startDate: '2023-01-27 00:06:18.179 +00:00',
        endDate: '2023-02-09 09:47:00.137 +00:00'
      },
      {
        spotId: 1,
        userId: 25,
        startDate: '2023-04-27 00:06:18.179 +00:00',
        endDate: '2023-04-30 09:47:00.137 +00:00'
      },
      {
        spotId: 1,
        userId: 69,
        startDate: '2021-04-27 00:06:18.179 +00:00',
        endDate: '2021-04-30 09:47:00.137 +00:00'
      },
      {
        spotId: 1,
        userId: 46,
        startDate: '2021-03-27 00:06:18.179 +00:00',
        endDate: '2021-03-30 09:47:00.137 +00:00'
      }
    ]
    return await queryInterface.bulkInsert(options, bookings)
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
