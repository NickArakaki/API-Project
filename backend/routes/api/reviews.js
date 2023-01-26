const router = require('express').Router();

const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReviewData = [
    check('review')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt()
      .withMessage('Stars must be an integer from 1 to 5'),
    check('stars')
      .custom( value => value > 5 || value < 1 ? false : true)
      .withMessage('Stars must be an integer from 1 to 5'),
      handleValidationErrors
  ]

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
        // console.log(review);
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

// UPDATE an existing review (REQ AUTHENTICATION AND AUTHORIZATION)
    // validate review data
router.put('/:reviewId', requireAuth, validateReviewData, async (req, res, next) => {
    const userReview = await Review.findByPk(req.params.reviewId);

    if (!userReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        next(err);
    } else if (userReview.userId !== req.user.id) {
        const authorizationErr = new Error('Forbidden');
        authorizationErr.status = 403;
        next(authorizationErr);
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
