const router = require('express').Router();
const { restoreUser } = require('../../utils/auth')
const sessionRouter = require('./session');
const usersRouter = require('./users');
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews');
const spotImagesRouter = require('./spot-images');
const reviewImagesRouter = require('./review-images');
const bookingsRouter = require('./bookings');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the db
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/review-images', reviewImagesRouter);

router.use('/bookings', bookingsRouter);

module.exports = router;
