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


const validation = [
    validBookingData,
    bookingEndDate,
    bookingExist,
    bookingValid,
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
    } else if (booking.userId !== req.user.id) {
        const authErr = new Error("Forbidden");
        authErr.status = 403;
        next(authErr);
    }

    const { startDate, endDate } = req.body;

    booking.set({ startDate, endDate });
    booking.validate();

    await booking.save();

    res.json(booking);
})

// DELETE a Booking (REQ AUTHENTICATION AND AUTHORIZATION)
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    console.log(booking.startDate.getTime())
    console.log(Date.now())
    console.log(booking.startDate.getTime() <= Date.now())

    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        next(err);
    } else if (booking.userId !== req.user.id) {
        const authErr = new Error("Forbidden");
        authErr.status = 403;
        next(authErr);
    } else if (booking.startDate.getTime() <= Date.now()) {
        console.log('we in it')
        const newErr = new Error('Cannot delete booking after startDate');
        newErr.status = 400;
        next(newErr);
    } else {
        await booking.destroy();
        res.json({ message: "Successfully deleted", statusCode: 200 })
    }
})

module.exports = router;
