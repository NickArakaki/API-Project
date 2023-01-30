const router = require('express').Router();

/************************ Models **********************/
const { SpotImage, Spot, User } = require('../../db/models');

/************************ Errors **********************/
const { authorizationError, notFound } = require('../../utils/errors');

/************************* Validators *****************/
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId, {
        include: [
            {
                model: Spot,
                include: {
                    model: User,
                    as: 'Owner'
                }
            }
        ]
    });

    if (!spotImage) {
        next(notFound('Spot Image'));
    } else if (spotImage.Spot.ownerId !== req.user.id) {
        next(authorizationError());
    } else {
        await spotImage.destroy();
        res.json({
            message: 'Successfully deleted',
            statusCode: 200
        });
    }
})

module.exports = router;
