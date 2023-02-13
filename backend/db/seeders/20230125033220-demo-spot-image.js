'use strict';
const { seedSpotImages } = require('../../utils/faker-seed');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'SpotImages';

module.exports = {
  async up (queryInterface, Sequelize) {
    const spotImages = seedSpotImages(25);
    return await queryInterface.bulkInsert(options, spotImages);
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
