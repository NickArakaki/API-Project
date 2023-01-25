const router = require('express').Router();

const { SpotImage, Spot, User } = require('../../db/models');
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
        const err = new Error("Spot image couldn't be found");
        err.status = 404;
        next(err);
    } else if (spotImage.Spot.ownerId !== req.user.id) {
        const authorizationErr = new Error('Forbidden');
        authorizationErr.status = 403;
        next(authorizationErr);
    } else {
        await spotImage.destroy();
        res.json({
            message: 'Successfully deleted',
            statusCode: 200
        });
    }
})

module.exports = router;
