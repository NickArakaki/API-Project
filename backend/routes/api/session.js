const router = require('express').Router();

/************************ Models **********************/
const { User } = require('../../db/models');

/************************* Validators *****************/
const { validateLogin } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

// Log in
router.post(
    '/',
    validateLogin, // check if username/email and password before query
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Login Failed');
            err.status = 401;
            err.title = 'Login failed';
            err.message = 'Invalid credentials';
            // err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        setTokenCookie(res, user);

        return res.json({
            user: user.toSafeObject()
        });
    }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    restoreUser,
    requireAuth,
    (req, res) => {
        const { user } = req;
        if (user) {
            return res.json({
                user: user.toSafeObject()
            });
        } else {
            return res.json({ user: null });
        }
    }
);

module.exports = router;
