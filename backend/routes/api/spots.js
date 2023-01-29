const router = require('express').Router();
const { appendFile } = require('fs');

/************************* Models **********************/
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');

/************************ Errors **********************/
const { notFound , authorizationError } = require('../../utils/errors');

/************************* Validators *****************/
const { validBookingData, bookingEndDate, validateTimeFrame } = require('../../utils/booking-validation');
const { validateSpot, validateReview, validateImage } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { queryFilter } = require('../../utils/query-filter');


// GET all Spots owned by current user (REQ AUTHENTICATION)
router.get('/current', requireAuth, async (req, res, next) => {
  let spots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    },
    include: [{ model: Review }, { model: SpotImage }]
  });

  const modifiedSpots = [];

  for (let spot of spots) {
    spot = spot.toJSON();

    // avgRating
    const avgRating = spot.Reviews.reduce((accumulator, review) => {
      return parseInt(review.stars) + accumulator
    }, 0) / spot.Reviews.length;

    if (avgRating) {
      spot.avgRating = avgRating.toFixed(1);
    } else {
      spot.avgRating = null
    }

    // previewImage
    const previewImage = spot.SpotImages.find(spotImage => spotImage.preview === true);

    if (previewImage) {
      spot.previewImage = previewImage.url
    } else {
      spot.previewImage = 'Preview Unavailable'
    }

    delete spot.SpotImages;
    delete spot.Reviews;
    modifiedSpots.push(spot);
  }

    return res.json({Spots: modifiedSpots});
  })

// GET all Bookings of a Spot based on the Spot's id
  // Do we want to limit bookings to current/future bookings?
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const attributes = ['spotId', 'startDate', 'endDate'];

  let include = [];

  // request more data if user is the owner of the Spot
  if (spot.ownerId === req.user.id) {
    attributes.push('id', 'userId', 'createdAt', 'updatedAt');
    include.push({
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    })
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    },
    include,
    attributes
  })

  res.send({Bookings: bookings})
})

// GET all Reviews by Spot Id
router.get('/:spotId/reviews', async (req, res, next) => {

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  } else {
    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    res.json({Reviews: reviews});
  }
})

// GET details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });

if (!spot) {
  const err = new Error("Spot couldn't be found");
  err.status = 404;
  next(err);
} else {
  let numRatings = await Review.count({
    where: {
      spotId: spot.id
    }
  });

  let totalStars = await Review.sum('stars', {
    where: {
      spotId: spot.id
    }
  });

  spot = spot.toJSON();
  spot.numReviews = numRatings;

  if (!numRatings) {
    spot.avgStarRating = null
  } else {
    const avgStarRating = (totalStars / numRatings).toFixed(1);
    spot.avgStarRating = (avgStarRating * 1);
  }

  res.json(spot);
}
})

// GET all spots
router.get('/', queryFilter, async (req, res) => {
  console.log(req.queryFilter.where.price);
  let spots = await Spot.findAll(req.queryFilter);

  spots = spots.map(spot => spot.toJSON());

  // Aggregate for average review score
  for (let spot of spots) {
      let numRatings = await Review.count({
        where: {
          spotId: spot.id
        }
      });

      let totalStars = await Review.sum('stars', {
        where: {
          spotId: spot.id
        }
      });

      if (numRatings && totalStars) {
          const avgRating = (totalStars / numRatings).toFixed(1);
          spot.avgRating = (avgRating * 1)
      } else {
          spot.avgRating = null
      }

      let previewImage = await SpotImage.findOne({
          where: {
              spotId: spot.id,
              preview: true
          }
      });

      if (previewImage) {
          previewImage = previewImage.toJSON().url;
          spot.previewImage = previewImage;
      } else {
          spot.previewImage = 'No Preview Image Available'
      }
  }

  res.json({Spots: spots});
});

// POST a Booking from a Spot based on SpotId (REQ AUTHENTICATION AND AUTHORIZATION)
router.post('/:spotId/bookings', requireAuth, validBookingData, bookingEndDate, validateTimeFrame, async (req, res, next) => {
  // get spot from id and make sure exists
  const spot = await Spot.findByPk(req.params.spotId);
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate)

  if (!spot) {
    // if not throw 404 error
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  } else if (spot.ownerId === req.user.id) {
    // user must not be the owner of the spot, otherwise authorization error
    const authErr = new Error('Fobidden');
    authErr.status = 403;
    next(authErr);
  } else {
      const newBooking = Booking.build({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate,
        endDate
      })
      newBooking.validate();
      await newBooking.save();

      res.json({newBooking});
  }
})

// POST an Image to a Spot based on SpotId (REQ AUTHENTICATION)
router.post('/:spotId/images', requireAuth, validateImage, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next (err);
  } else if (spot.ownerId !== req.user.id) {
    // check to make sure the owner id matches the current user id
    // if not throw an authorization error
    const authErr = new Error('Forbidden');
    authErr.status = 403;
    next(authErr);
  } else {
    // else get the image from req body
    const { url, preview } = req.body;
    // add to review images table
    const newSpotImage = SpotImage.build({
      spotId: req.params.spotId,
      url,
      preview
    });
    newSpotImage.validate();
    await newSpotImage.save();
    // await newSpotImage.save();
    // return res
    // WILL WANT TO REFACTOR THIS BEFORE MONDAY
    res.json({id: newSpotImage.id, url: newSpotImage.url, preview: newSpotImage.preview});
  }
})

// POST Review for Spot by SpotId (REQ AUTHENTICATION):
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  // build a review obj with the data from req.body
  const spot = await Spot.findByPk(req.params.spotId);
  const previousReview = await Review.findOne({
    where: {
      spotId: req.params.spotId,
      userId: req.user.id
    }
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  } else if (previousReview) {
    const reviewError = new Error('User already has a review for this spot');
    reviewError.status = 403;
    next(reviewError);
  } else {
    const { review, stars } = req.body;
    // use req.params.spotId to assign spotId to reviewObj
    const newReview = Review.build({
      spotId: req.params.spotId,
      userId: req.user.id,
      review,
      stars
    })
    // validate review obj
    newReview.validate();
    // save review obj
    await newReview.save();
    // return review obj
    res.status(201).json(newReview);
  }
})

// POST a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // check if address is already in db
    let spot = await Spot.findAll({
        where: {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name
        }
    });

    if (spot.length) {
        const err = new Error('Spot already exists');
        err.status = 403;
        next(err);
    } else {
        const spot = Spot.build({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        spot.validate();
        await spot.save();

        const newSpot = await Spot.findByPk(spot.id);
        res.status(201).json(newSpot);
    }
})

// PUT a Spot based on SpotId (REQ AUTHENTICATION AND AUTHORIZATION)
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

    // if spot doesn't exist throw 404 error
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err)
  } else if (spot.ownerId !== req.user.id) {
    // compare spot owner id to user id
    // if no match throw an authorization error
    const authError = new Error('Fobidden');
    authError.status = 403;
    next(authError);
  } else {
    // if match update spot with data from req.body
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    // validate changes
    spot.set({ address, city, state, country, lat, lng, name, description, price });
    spot.validate();
    await spot.save();
    // save changes
    // return updated spot
    res.json(spot);
  }
})

// DELETE a Spot (REQ AUTHENTICATION AND AUTHORIZATION)
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  } else if (spot.ownerId !== req.user.id) {
    const authError = new Error('Forbidden');
    authError.status = 403;
    next(authError);
  } else {
    await spot.destroy();
    res.json({ message: "Successfully deleted", "statusCode": 200 });
  }
})

module.exports = router;
