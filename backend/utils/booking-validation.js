const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');
const { Booking } = require('../db/models');
const { Op } = require('sequelize');
const { notFound, authorizationError } = require('./errors');

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

const extSpotId = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    req.spotId = booking.spotId;
    console.log(req.spotId);
    next();
}

const bookingExist = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
        return next(notFound('Booking'))
    }

    req.booking = booking;
    next();
}

const bookingValid = async (req, res, next) => {
    const booking = req.booking;

    if (booking.endDate.getTime() < Date.now()) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        next(err);
    } else {
        next()
    }
}

const validateUpdateTimeFrame = async (req, res, next) => {
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
            userId: {
                [Op.ne]: req.user.id
            }
        },
        order: [['startDate', 'DESC']]
    })

    const nextBooks = await Booking.findAll({
        where: {
            spotId: req.spotId || req.params.spotId,
            startDate: {
                [Op.gte]: startDate
            },
            userId: {
                [Op.ne]: req.user.id
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

const validation = [
    validBookingData,
    bookingEndDate,
    bookingExist,
    bookingValid,
    extSpotId,
    validateUpdateTimeFrame
]

module.exports = {
    validBookingData,
    bookingEndDate,
    validateTimeFrame,
    extSpotId,
    bookingExist,
    bookingValid,
    validateUpdateTimeFrame,
    validation
}
