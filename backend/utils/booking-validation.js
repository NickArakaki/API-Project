const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');
const { Booking } = require('../db/models');
const { Op } = require('sequelize');


// Middleware for validating booking data before querying
const validBookingData = [
    check('startDate')
      .exists()
      .notEmpty()
      .withMessage('startDate is required'),
    check('endDate')
      .exists()
      .notEmpty()
      .withMessage('endDate is required'),
    handleValidationErrors
  ]

// middleware check endDate is after startDate
const bookingEndDate = (req, res, next) => {
    const err = new Error('Validation error');
    err.status = 400;
    err.title = 'Bad Request';
    err.errors = {};

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    if (endDate <= startDate) {
        err.errors.endDate = 'endDate cannot be on or before startDate'
        return next(err);
    } else {
        next();
    }
}

// middleware for validating booking data
const validateTimeFrame = async (req, res, next) => {
    const err = new Error('Sorry, this spot is already booked for the specified dates');
    err.status = 403;
    err.errors = {};

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const prevBooks = await Booking.findAll({
        where: {
        startDate: {
            [Op.lte]: startDate
        },
        spotId: req.spotId || req.params.spotId,
        },
        order: [['startDate', 'DESC']]
    })

    const nextBooks = await Booking.findAll({
        where: {
        spotId: req.spotId || req.params.spotId,
        startDate: {
            [Op.gte]: startDate
        }
        },
        order: [['startDate', 'ASC']]
    })

    const prevBook = prevBooks[0];
    const nextBook = nextBooks[0];


    if (prevBook) {
        const prevBookEnd = new Date(prevBook.endDate.toDateString());
        // previous Booking endDate is after new Start Date
        if (prevBookEnd >= new Date(startDate.toDateString())) {
            err.errors.startDate = 'Start date conflicts with an existing booking'
        }
    }

    if (nextBook) {
        const nextBookStart = new Date(nextBook.startDate.toDateString());
        const newBookEnd = new Date(endDate.toDateString());

        // next Booking start date is before new Booking endDate
        if (nextBookStart <= new Date(endDate.toDateString())) {
            err.errors.endDate = 'End date conflicts with an existing booking'
        }
    }

    if (Object.keys(err.errors).length) {
        next(err)
    } else {
        next();
    }
}

module.exports = {
    validBookingData,
    bookingEndDate,
    validateTimeFrame
}
