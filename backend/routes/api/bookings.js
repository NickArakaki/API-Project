const router = require('express').Router();
const { Booking, User, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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
            booking.Spot.previewImage = spotImage;
        } else {
            booking.Spot.previewImage = 'No Preview Image Available'
        }
        userBookings.push(booking);
    }

    res.json({Bookings: userBookings});
})

module.exports = router;
