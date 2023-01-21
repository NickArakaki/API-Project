const router = require('express').Router();
const { restoreUser } = require('../../utils/auth')
const sessionRouter = require('./session');
const usersRouter = require('./users');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the db
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

module.exports = router;
