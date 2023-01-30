const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};

      validationErrors.array().forEach(error => {
        console.log(error);
        let param = error.param;
        errors[param] = error.msg
      });

      const err = Error('Validation error');
      err.errors = errors;
      err.status = 400;
      err.title = 'Bad request.';
      next(err);
    }
    next();
  };

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

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required'),
  check('lat') // update once we know the specs
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Latitude is required')
    .isNumeric()
    .custom(lat => (lat <= 90 && lat >= -90))
    .withMessage('Latitude must be between -90 and 90 degrees'),
  check('lng') // update once we know the specs
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Longitude is required')
    .isNumeric()
    .custom(lng => (lng <= 180 && lng >= -180))
    .withMessage('Longitude must be between -180 and 180 degrees'),
  check('name') // update once we know the specs, update table and model
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Name is rerquired')
    .custom(name => (name.length > 3 && name.length < 50))
    .withMessage('Name must be between 3 and 50 characters long'),
  check('description') // update once we know the specs, update table and model
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required'),
  check('price') // update once we know the specs, update table and model
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Price per day is required')
    .isNumeric()
    .withMessage('Price per day must be a number'),
  handleValidationErrors
];

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage('Stars must be an integer from 1 to 5'),
  check('stars')
    .custom( value => value > 5 || value < 1 ? false : true)
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

const validateImage = [
  check('url')
    .exists()
    .notEmpty()
    .withMessage('URL required'),
  check('preview')
    .isBoolean()
    .withMessage('Preview must be a boolean'),
  handleValidationErrors
]

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateSpot,
  validateReview,
  validateImage
};
