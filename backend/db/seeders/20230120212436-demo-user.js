'use strict';
/** @type {import('sequelize-cli').Migration} */

// const bcrypt = require('bcryptjs');
const { seedUsers } = require('../../utils/faker-seed');

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Users';

module.exports = {
  async up (queryInterface, Sequelize) {
    const users = seedUsers(10);
    return await queryInterface.bulkInsert(options, users, {});
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options)
  }
};
