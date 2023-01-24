const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup, // check if the required fields are appropriately filled out before query
    async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;

      console.log(email);
      // check if user exists before signing up
      let users = await User.findAll({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });

      users = users.map(user => user.toJSON());

      if (users.length) {
        const error = new Error('User already exists');
        error.status = 403;
        error.errors = {};

        // iterate over users and check if username or email matches the req.body
        users.forEach(user => {
          if (user.email === email) {
            error.errors = { 'email': "User with that email already exists" };
          } else if (user.username === username) {
            error.errors = { 'username': 'User with that username already exists' };
          }
        })
        next(error);
      } else {
        const newUser = await User.signup({ email, username, password, firstName, lastName });
        setTokenCookie(res, newUser);
        res.json({
          user: newUser.toSafeObject()
        });
      }




    }
  );

module.exports = router;
