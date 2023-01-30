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
      spot.previewImage = 'No Preview Image Available'
    }

    delete spot.SpotImages;
    delete spot.Reviews;
    modifiedSpots.push(spot);
  }

    return res.json({Spots: modifiedSpots});
  })

// GET all Bookings of a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return next(notFound('Spot'))
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

  let spot = await Spot.findByPk(req.params.spotId, {
    include: {
      model: Review,
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
    }
  });

  if (!spot) {
    next(notFound('Spot'));
  } else {
    res.json({ Reviews: spot.Reviews });
  }
})

// GET details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review
      },
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
  next(notFound('Spot'));
} else {
  spot = spot.toJSON();

  const numReviews = spot.Reviews.length;
  spot.numReviews = numReviews;

  const avgRating = spot.Reviews.reduce((accumulator, review) => {
    return parseInt(review.stars) + accumulator
  }, 0) / numReviews;

  if (avgRating) {
    spot.avgStarRating = avgRating.toFixed(1)
  } else {
    spot.avgStarRating = null
  }

  delete spot.Reviews;

  res.json(spot);
}
})

// GET all spots
router.get('/', queryFilter, async (req, res) => {
  let spots = await Spot.findAll({
    include: [{ model: Review }, { model: SpotImage }],
    ...req.queryFilter
  });

  const processedSpots = [];

  for (let spot of spots) {
    spot = spot.toJSON();

    // avgRating
    const avgRating = spot.Reviews.reduce((accumulator, review) => {
      return parseInt(review.stars) + accumulator
    }, 0) / spot.Reviews.length;

    if (avgRating) {
      spot.avgRating = avgRating.toFixed(1);
    } else {
      spot.avgRating = null;
    }

    // previewImage
    const previewImage = spot.SpotImages.find(spotImage => spotImage.preview === true);
    if (previewImage) {
      spot.previewImage = previewImage.url
    } else {
      spot.previewImage = 'No Preview Image Available'
    }

    delete spot.SpotImages;
    delete spot.Reviews;

    processedSpots.push(spot);
  }

  res.json({Spots: processedSpots});
});

// POST a Booking from a Spot based on SpotId (REQ AUTHENTICATION AND AUTHORIZATION)
router.post('/:spotId/bookings', requireAuth, validBookingData, bookingEndDate, validateTimeFrame, async (req, res, next) => {
  // get spot from id and make sure exists
  const spot = await Spot.findByPk(req.params.spotId);
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate)

  if (!spot) {
    next(notFound('Spot'))
  } else if (spot.ownerId === req.user.id) {
    next(authorizationError());
  } else {
      const newBooking = Booking.build({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate,
        endDate
      })
      newBooking.validate();
      await newBooking.save();

      res.json(newBooking);
  }
})

// POST an Image to a Spot based on SpotId (REQ AUTHENTICATION)
router.post('/:spotId/images', requireAuth, validateImage, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    next(notFound('Spot'));
  } else if (spot.ownerId !== req.user.id) {
    next(authorizationError())
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

    const data = { id: newSpotImage.id, url: newSpotImage.url, preview: newSpotImage.preview };
    res.json(data);
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
    next(notFound('Spot'));
  } else if (previousReview) {
    const reviewError = new Error('User already has a review for this spot');
    reviewError.status = 403;
    next(reviewError);
  } else {
    const { review, stars } = req.body;

    const newReview = Review.build({
      spotId: req.params.spotId,
      userId: req.user.id,
      review,
      stars
    })

    newReview.validate();

    await newReview.save();

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
    next(notFound('Spot'));
  } else if (spot.ownerId !== req.user.id) {
    next(authorizationError());
  } else {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    spot.set({ address, city, state, country, lat, lng, name, description, price });
    spot.validate();
    await spot.save();
    res.json(spot);
  }
})

// DELETE a Spot (REQ AUTHENTICATION AND AUTHORIZATION)
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    next(notFound('Spot'))
  } else if (spot.ownerId !== req.user.id) {
    next(authorizationError());
  } else {
    await spot.destroy();
    res.json({ message: "Successfully deleted", "statusCode": 200 });
  }
})

module.exports = router;
