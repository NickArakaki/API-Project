const router = require('express').Router();
const { Op } = require('sequelize');

/************************ Models **********************/
const { Booking, User, Spot, SpotImage } = require('../../db/models');

/************************ Errors **********************/
const { notFound , authorizationError } = require('../../utils/errors');

/************************ Validators ******************/
const { validBookingData, bookingEndDate, validateUpdateTimeFrame, extSpotId, bookingExist, bookingValid } = require('../../utils/booking-validation');
const { requireAuth } = require('../../utils/auth');

// const extSpotId = async (req, res, next) => {
//     const booking = await Booking.findByPk(req.params.bookingId);
//     req.spotId = booking.spotId;
//     console.log(req.spotId);
//     next();
// }

// const bookingExist = async (req, res, next) => {
//     const booking = await Booking.findByPk(req.params.bookingId);
//     if (!booking) {
//         return next(notFound('Booking'))
//     }

//     req.booking = booking;
//     next();
// }

// const bookingValid = async (req, res, next) => {
//     const booking = req.booking;

//     if (booking.endDate.getTime() < Date.now()) {
//         const err = new Error("Past bookings can't be modified");
//         err.status = 403;
//         next(err);
//     } else {
//         next()
//     }
// }

// const validateUpdateTimeFrame = async (req, res, next) => {
//     const err = new Error('Sorry, this spot is already booked for the specified dates');
//     err.status = 403;
//     err.errors = {};

//     const startDate = new Date(req.body.startDate);
//     const endDate = new Date(req.body.endDate);

//     const prevBooks = await Booking.findAll({
//         where: {
//             startDate: {
//                 [Op.lte]: startDate
//             },
//             spotId: req.spotId || req.params.spotId,
//             userId: {
//                 [Op.ne]: req.user.id
//             }
//         },
//         order: [['startDate', 'DESC']]
//     })

//     const nextBooks = await Booking.findAll({
//         where: {
//             spotId: req.spotId || req.params.spotId,
//             startDate: {
//                 [Op.gte]: startDate
//             },
//             userId: {
//                 [Op.ne]: req.user.id
//             }
//         },
//         order: [['startDate', 'ASC']]
//     })

//     const prevBook = prevBooks[0];
//     const nextBook = nextBooks[0];


//     if (prevBook) {
//         const prevBookEnd = new Date(prevBook.endDate.toDateString());
//         // previous Booking endDate is after new Start Date
//         if (prevBookEnd >= new Date(startDate.toDateString())) {
//             err.errors.startDate = 'Start date conflicts with an existing booking'
//         }
//     }

//     if (nextBook) {
//         const nextBookStart = new Date(nextBook.startDate.toDateString());
//         const newBookEnd = new Date(endDate.toDateString());

//         // next Booking start date is before new Booking endDate
//         if (nextBookStart <= new Date(endDate.toDateString())) {
//             err.errors.endDate = 'End date conflicts with an existing booking'
//         }
//     }

//     if (Object.keys(err.errors).length) {
//         next(err)
//     } else {
//         next();
//     }
// }

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
