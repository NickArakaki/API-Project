const router = require('express').Router();

/************************* Models *********************/
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');

/************************ Errors **********************/
const { notFound , authorizationError } = require('../../utils/errors');

/************************* Validators *****************/
const { requireAuth } = require('../../utils/auth');
const { validateReview } = require('../../utils/validation');

/************************** Routes ********************/

// GET all Reviews of the current User
router.get('/current', requireAuth, async (req, res, next) => {
    const reviews = await Review.findAll({
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
                    exclude: ['createdAt', 'updatedAt', 'description']
                },
                include: {
                    model: SpotImage,
                    attributes: ['preview', 'url']
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const modifiedReviews = [];

    for (let review of reviews) {
        review = review.toJSON();
        const previewImage = review.Spot.SpotImages.find(spotImage => spotImage.preview === true)

        if (previewImage) {
            review.Spot.previewImage = previewImage.url
        } else {
            review.Spot.previewImage = 'Preview Unavailable'
        }

        delete review.Spot.SpotImages;

        modifiedReviews.push(review);
    }

    res.json({ Reviews: modifiedReviews });
})

// POST Image to a Review based on Review's id (REQ AUTHENTICATION & AUTHORIZATION), MAX 10 / Review
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
        next(notFound('Review'))
    } else if (review.userId !== req.user.id) {
        next(authorizationError())
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

// UPDATE an existing review (REQ AUTHENTICATION AND AUTHORIZATION)
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const userReview = await Review.findByPk(req.params.reviewId);

    if (!userReview) {
        next(notFound('Review'))
    } else if (userReview.userId !== req.user.id) {
        next(authorizationError())
    } else {
        const { review, stars } = req.body;

        userReview.set({ review, stars });
        userReview.validate();
        await userReview.save();

        res.json(userReview);
    }
})

// DELETE a Review (REQ AUTHENTICATION AND AUTHROIZATION)
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        next(notFound('Review'));
    } else if (review.userId !== req.user.id) {
        next(authorizationError());
    } else {
        await review.destroy();
        res.json({ message: "Successfully deleted", "statusCode": 200 });
    }
})

module.exports = router;
