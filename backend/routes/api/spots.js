const router = require('express').Router();
const { appendFile } = require('fs');
const { Spot, User, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth, restoreUser } = require('../../utils/auth');

// MAKE MIDDLEWARE TO CHECK IF SPOT EXISTS...maybe

const validateAddSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Country is required'),
    check('lat') // update once we know the specs
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Latitude not valid'),
    check('lng') // update once we know the specs
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Longitude not valid'),
    check('name') // update once we know the specs, update table and model
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Name is rerquired'),
    check('name')
      .custom(val => val.length < 50)
      .withMessage('Name must be less than 50 characters'),
    check('description') // update once we know the specs, update table and model
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required'),
    check('price') // update once we know the specs, update table and model
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];

// GET all spots
router.get('/', async (req, res) => {
    let spots = await Spot.findAll();

    spots = spots.map(spot => spot.toJSON());

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
            spot.avgRating = avgRating
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

// POST a spot
router.post('/', requireAuth, validateAddSpot, async (req, res, next) => {
    const user = req.user.toJSON();
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
        const err = new Error('Location already in database');
        err.status = 403;
        next(err);
    } else {
        const spot = Spot.build({
            ownerId: user.id,
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
        res.json(newSpot);
    }
})

// GET all Spots owned by current user
router.get('/current', requireAuth, async (req, res, next) => {
  const user = req.user.toJSON();

  let spots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  });

  spots = spots.map(spot => spot.toJSON());

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
        spot.avgRating = avgRating
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

  return res.json({Spots: spots});
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

    if (numRatings && totalStars) {
        const avgRating = (totalStars / numRatings).toFixed(1);
        console.log('totalStars: ', totalStars);
        console.log('numRatings: ', numRatings);
        console.log('avg: ', (totalStars / numRatings));

        spot.avgRating = avgRating
    }

    spot = spot.toJSON();
    spot.numReviews = numRatings;
    spot.avgStarRating = (totalStars / numRatings).toFixed(1);
    res.json(spot);
  }
})

// POST an Image to a Spot based on SpotId (REQ AUTH)
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  // get the spot from the id
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

// PUT a Spot based on SpotId (REQ AUTHENTICATION AND AUTHORIZATION)
router.put('/:spotId', requireAuth, validateAddSpot, async (req, res, next) => {
  // get spot from id
  const spot = await Spot.findByPk(req.params.spotId);
    // if spot doesn't exist throw 404 error
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err)
  } else if (spot.id !== req.user.id) {
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

//

module.exports = router;
