const router = require('express').Router();
const { Op } = require('sequelize');

/************************ Models **********************/
const { Booking, User, Spot, SpotImage } = require('../../db/models');

/************************ Errors **********************/
const { notFound , authorizationError } = require('../../utils/errors');

/************************ Validators ******************/
const { validBookingData, bookingEndDate, validateUpdateTimeFrame, extSpotId, bookingExist, bookingValid } = require('../../utils/booking-validation');
const { requireAuth } = require('../../utils/auth');


const validation = [
    validBookingData,
    bookingEndDate,
    bookingExist,
    bookingValid,
    extSpotId,
    validateUpdateTimeFrame
]

// GET all of Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    let bookings = await Booking.findAll({
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'description']
                },
                include: {
                    model: SpotImage,
                    attributes: ['preview', 'url']
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

        const previewImage = booking.Spot.SpotImages.find(spotImage => spotImage.preview = true);

        if (previewImage) {
            booking.Spot.previewImage = previewImage.url
        } else {
            booking.Spot.previewImage = 'No Preview Image Available'
        }

        delete booking.Spot.SpotImages;

        userBookings.push(booking);
    }

    res.json({Bookings: userBookings});
})

// PUT a Booking based on Booking Id (REQ AUTHENTICATION AND AUTHORIZATION)
router.put('/:bookingId', requireAuth, validation, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (booking.userId !== req.user.id) {
        return next(authorizationError())
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

    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        next(err);
    } else if (booking.userId !== req.user.id) {
        const authErr = new Error("Forbidden");
        authErr.status = 403;
        next(authErr);
    } else if (booking.startDate.getTime() <= Date.now()) {
        const newErr = new Error('Cannot delete booking after startDate');
        newErr.status = 403;
        next(newErr);
    } else {
        await booking.destroy();
        res.json({ message: "Successfully deleted", statusCode: 200 })
    }
})

module.exports = router;
