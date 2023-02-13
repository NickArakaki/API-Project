const router = require('express').Router();
const { Op } = require('sequelize');
const { setTokenCookie } = require('../../utils/auth');

/************************ Models **********************/
const { User } = require('../../db/models');

/************************* Validators *****************/
const { validateSignup } = require('../../utils/validation');

// Sign up
router.post(
    '/',
    validateSignup, // check if the required fields are appropriately filled out before query
    async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;

      // check if user exists before signing up
      let users = await User.findAll({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (users.length) {
        const error = new Error('User already exists');
        error.status = 403;
        error.errors = {};

        // iterate over users and check if username or email matches the req.body
        users.forEach(user => {
          if (user.email === email) {
            // error.errors = { 'email': "User with that email already exists" };
            error.errors.email = "User with that email already exists";
          }
          if (user.username === username) {
            // error.errors = { 'username': 'User with that username already exists' };
            error.errors.username = "User with that username already exists"
          }
        })
        next(error);
      } else {
        let newUser = await User.signup({ email, username, password, firstName, lastName });
        setTokenCookie(res, newUser);
        newUser = newUser.toJSON();
        res.json(newUser);
      }
    }
  );

module.exports = router;
