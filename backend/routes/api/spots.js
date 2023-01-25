const router = require('express').Router();
const { appendFile } = require('fs');
const { Spot, User, SpotImage, Review, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth, restoreUser } = require('../../utils/auth');

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
        // let avgRating = await Review.findOne({
        //     attributes: {
        //         include: [
        //             [
        //                 sequelize.fn("AVG", sequelize.col("stars")),
        //                 "avgRating"
        //             ]
        //         ]
        //     },
        //     where: {
        //         spotId : spot.id
        //     }
        // });
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
    // let avgRating = await Review.findOne({
    //     attributes: {
    //         include: [
    //             [
    //                 sequelize.fn("AVG", sequelize.col("stars")),
    //                 "avgRating"
    //             ]
    //         ]
    //     },
    //     where: {
    //         spotId : spot.id
    //     }
    // });
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
    //   const reviewAggregate = await Review.findOne({
    //     attributes: {
    //       include: [
    //         [
    //           sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"
    //         ],
    //         [
    //           sequelize.fn('COUNT', sequelize.col('id')), 'numReviews'
    //         ]
    //       ]
    //   },
    //   where: {
    //     spotId: req.params.spotId
    //   }
    // })
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
    // const { avgStarRating, numReviews } = reviewAggregate.toJSON();

    // spot.avgStarRating = avgStarRating.toFixed(1);
    // spot.numReviews = numReviews;

    res.json(spot);
  }
})

module.exports = router;
