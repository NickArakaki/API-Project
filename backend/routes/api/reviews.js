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

// POST Image to a Review based on Review's id (REQ AUTHENTICATION & AUTHORIZATION)
    // validation middleware?
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId, {
        include: [
            {
                model: ReviewImage,
                attributes: ['url']
            }
        ]
    });

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        next(err);
    } else if (review.userId !== req.user.id) {
        const authErr = new Error("Forbidden");
        authErr.status = 403;
        next(authErr);
    } else if (review.ReviewImages.length >= 10) {
        const sizeErr = new Error('Maximum number of images for this resource was reached');
        sizeErr.status = 403;
        next(sizeErr)
    } else {
        const { url } = req.body;
        const reviewImage = ReviewImage.build({
            reviewId: req.params.reviewId,
            url
         });
        reviewImage.validate();
        await reviewImage.save();
        res.json({
            id: reviewImage.id,
            url: reviewImage.url
        });
    }
})

module.exports = router;
