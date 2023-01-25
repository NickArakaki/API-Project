const router = require('express').Router();
const { appendFile } = require('fs');
const { Spot, SpotImage, Review, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


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
        let avgRating = await Review.findOne({
            attributes: {
                include: [
                    [
                        sequelize.fn("AVG", sequelize.col("stars")),
                        "avgRating"
                    ]
                ]
            },
            where: {
                spotId : spot.id
            }
        });

        if (avgRating) {
            avgRating = avgRating.toJSON().avgRating;
            spot.avgRating = avgRating;
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
router.post('/', validateAddSpot, async (req, res, next) => {
    const { address, city, state, ocuntry, lat, lng, name, description, price } = req.body;


})

module.exports = router;
