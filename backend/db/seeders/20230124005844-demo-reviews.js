'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Reviews'

module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'Happiest Place On Earth!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Hottest Place On Earth!',
        stars: 1
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options);
  }
};
