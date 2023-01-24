'use strict';
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Nick',
        lastName: 'Arakaki',
        username: 'Demo-lition1',
        hashedPassword: bcrypt.hashSync('password'),
        email: 'demo1@user.io'
      },
      {
        firstName: 'Nick',
        lastName: 'Arakaki',
        username: 'Demo-lition2',
        hashedPassword: bcrypt.hashSync('password'),
        email: 'demo2@user.io'
      },
      {
        firstName: 'Nick',
        lastName: 'Arakaki',
        username: 'Demo-lition3',
        hashedPassword: bcrypt.hashSync('password'),
        email: 'demo3@user.io'
      },
      {
        firstName: 'Nick',
        lastName: 'Arakaki',
        username: 'Demo-lition4',
        hashedPassword: bcrypt.hashSync('password'),
        email: 'demo4@user.io'
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {})
  }
};
