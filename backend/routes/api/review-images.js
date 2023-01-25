const router = require('express').Router();

const { ReviewImage, Review } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

// DELETE Review Image (REQ AUTHENTICATION AND AUTHORIZATION)
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
        include: [
            {
                model: Review,
                attributes: ['userId']
            }
        ]
    });

    if (!reviewImage) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        next(err);
    } else if (reviewImage.Review.userId !== req.user.id) {
        const authorizationErr = new Error("Forbidden");
        authorizationErr.status = 403;
        next(authorizationErr);
    } else {
        await reviewImage.destroy();
        res.json({
            message: "Successfully deleted",
            statusCode: 200
        });
    }
})

module.exports = router;
