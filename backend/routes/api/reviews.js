const router = require('express').Router();

const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const spotimage = require('../../db/models/spotimage');

const { requireAuth } = require('../../utils/auth');

// GET all Reviews of the current User
router.get('/current', requireAuth, async (req, res, next) => {
    let reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    reviews = reviews.map(review => review.toJSON());

    for (let review of reviews) {
        const previewImage = await SpotImage.findByPk(review.Spot.id);
        review.Spot.previewImage = previewImage.url;
    }

    res.json({ Reviews: reviews });
})

module.exports = router;
