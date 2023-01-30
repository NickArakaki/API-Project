const router = require('express').Router();

const { ReviewImage } = require('../../db/models');

/************************ Errors **********************/
const { notFound , authorizationError } = require('../../utils/errors');

/************************ Validators ******************/
const { requireAuth } = require('../../utils/auth');

// DELETE Review Image (REQ AUTHENTICATION AND AUTHORIZATION)
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);

    if (!reviewImage) {
        next(notFound('Review Image'))
    } else if (reviewImage.Review.userId !== req.user.id) {
        next(authorizationError());
    } else {
        await reviewImage.destroy();
        res.json({
            message: "Successfully deleted",
            statusCode: 200
        });
    }
})

module.exports = router;
