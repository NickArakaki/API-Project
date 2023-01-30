const router = require('express').Router();

/************************ Models **********************/
const { Booking, Spot, SpotImage } = require('../../db/models');

/************************ Errors **********************/
const { authorizationError, notFound } = require('../../utils/errors');

/************************ Validators ******************/
const { validation } = require('../../utils/booking-validation');
const { requireAuth } = require('../../utils/auth');


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
        next(notFound('Booking'))
    } else if (booking.userId !== req.user.id) {
        next(authorizationError())
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
