const router = require('express').Router();
const { Spot, SpotImage, Review, sequelize } = require('../../db/models');

// GET all spots
router.get('/', async (req, res, next) => {
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
})

module.exports = router;
