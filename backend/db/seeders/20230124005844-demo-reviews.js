'use strict';
const { seedReviews } = require('../../utils/faker-seed');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Reviews'

module.exports = {
  async up (queryInterface, Sequelize) {
    const reviews = seedReviews(500);
    return await queryInterface.bulkInsert(options, reviews)
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
