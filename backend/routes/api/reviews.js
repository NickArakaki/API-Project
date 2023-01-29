const router = require('express').Router();

/************************* Models *********************/
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');

/************************ Errors **********************/
const { notFound , authorizationError } = require('../../utils/errors');

/************************* Validators *****************/
const { requireAuth } = require('../../utils/auth');
const { validateReview } = require('../../utils/validation');

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
                    exclude: ['createdAt', 'updatedAt', 'description']
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
        let previewImage = await SpotImage.findOne({
            where: {
                spotId: review.Spot.id,
                preview: true
            }
        });

        if (previewImage) {
            review.Spot.previewImage = previewImage.url;
        } else {
            review.Spot.previewImage = 'Image not available'
        }
    }

    res.json({ Reviews: reviews });
})

// POST Image to a Review based on Review's id (REQ AUTHENTICATION & AUTHORIZATION)
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
        const err = new Error("Review couldn't be found");
        err.status = 404;
        next(err);
    } else if (review.userId !== req.user.id) {
        const authorizationErr = new Error('Forbidden');
        authorizationErr.status = 403;
        next(authorizationErr);
    } else {
        await review.destroy();
        res.json({ message: "Successfully deleted", "statusCode": 200 });
    }
})

module.exports = router;
