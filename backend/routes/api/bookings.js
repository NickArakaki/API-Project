const router = require('express').Router();
const { Booking, User, Spot, SpotImage } = require('../../db/models');

const { validBookingData, bookingEndDate, validateTimeFrame } = require('../../utils/booking-validation');

const { requireAuth } = require('../../utils/auth');

const extSpotId = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    req.spotId = booking.spotId;
    console.log(req.spotId);
    next();
}

const bookingExist = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err)
    }

    next();
}

const endDateVerification = (req, res, next) => {
    const endDate = new Date(req.body.endDate);
    if (endDate.getTime() <= Date.now()) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        next(err);
    }
    next()
}

const validation = [
    validBookingData,
    bookingEndDate,
    endDateVerification,
    bookingExist,
    extSpotId,
    validateTimeFrame
]

// GET all of Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    let bookings = await Booking.findAll({
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ],
        where: {
            userId: req.user.id
        }
    });

    const userBookings = [];

    for(let booking of bookings) {
        booking = booking.toJSON();

        const spotImage = await SpotImage.findOne({
            where: {
                spotId: booking.spotId,
                preview: true
            }
        })

        if (spotImage) {
            booking.Spot.previewImage = spotImage.url;
        } else {
            booking.Spot.previewImage = 'No Preview Image Available'
        }
        userBookings.push(booking);
    }

    res.json({Bookings: userBookings});
})

// PUT a Booking based on Booking Id (REQ AUTHENTICATION AND AUTHORIZATION)
router.put('/:bookingId', requireAuth, validation, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const { startDate, endDate } = req.body;

    booking.set({ startDate, endDate });
    booking.validate();

    await booking.save();

    res.json(booking);
})

module.exports = router;
