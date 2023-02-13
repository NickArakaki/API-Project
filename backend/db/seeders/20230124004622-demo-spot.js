'use strict';
const { seedSpots } = require('../../utils/faker-seed');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Spots';

module.exports = {
  async up (queryInterface, Sequelize) {
    const spots = seedSpots(100);
    return await queryInterface.bulkInsert(options, spots)
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
