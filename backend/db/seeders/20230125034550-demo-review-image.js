'use strict';
const { seedReviewImages } = require('../../utils/faker-seed');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'ReviewImages'

module.exports = {
  async up (queryInterface, Sequelize) {
    const reviewImages = seedReviewImages(10);
    return await queryInterface.bulkInsert(options, reviewImages);
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
