const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {}
      const errorsList = validationErrors
        .array()
        .forEach(error => {
          let param = error.param;
          errors[param] = error.msg
        });

      const err = Error('Bad request.');
      err.errors = errors;
      err.status = 400;
      err.title = 'Bad request.';
      next(err);
    }
    next();
  };

  module.exports = {
    handleValidationErrors
  };
