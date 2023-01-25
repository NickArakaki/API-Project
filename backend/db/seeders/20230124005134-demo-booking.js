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
    const bookings = seedBookings(50);
    return await queryInterface.bulkInsert(options, bookings)
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
