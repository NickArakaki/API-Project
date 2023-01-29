const { Op } = require('sequelize');
const { query } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const checkQuery = [
    query('size')
        .optional({ checkFalsy: true })
        .isInt()
        .custom(size => size >= 1)
        .withMessage('Size parameter must be greater than or equal to 1'),
    query('page')
        .optional({ checkFalsy: true })
        .isInt()
        .custom(page => page >= 1)
        .withMessage('Page parameter must be greater than or equal to 1'),
    query('minLat')
        .optional({ checkFalsy: true })
        .isNumeric()
        .custom(lat => (lat <= 90 && lat >= -90))
        .withMessage('minLat parameter must be between -90 and 90 degrees'),
    query('maxLat')
        .optional({ checkFalsy: true })
        .isNumeric()
        .custom(lat => (lat <= 90 && lat >= -90))
        .withMessage('maxLat parameter must be between -90 and 90 degrees'),
    query('minLng')
        .optional({ checkFalsy: true })
        .isNumeric()
        .custom(lng => (lng <= 180 && lng >= -180))
        .withMessage('minLng parameter must be between -180 and 180 degrees'),
    query('maxLng')
        .optional({ checkFalsy: true })
        .isNumeric()
        .custom(lng => (lng <= 180 && lng >= -180))
        .withMessage('maxLng parameter must be between -180 and 180 degrees'),
    query('minPrice')
        .optional({ checkFalsy: true })
        .isNumeric()
        .custom(minPrice => minPrice >= 0)
        .withMessage('minPrice cannot be less than 0'),
    query('maxPrice')
        .optional({ checkFalsy: true })
        .isNumeric()
        .custom(maxPrice => maxPrice >= 0)
        .withMessage('maxPrice cannot be less than than 0'),
    handleValidationErrors
]

const queryValidation = (req, res, next) => {
    const err = new Error('Validation error')
    err.status = 400;
    err.errors = {}


    const minLat = req.query.minLat || -90;
    const maxLat = req.query.maxLat || 90;
    if ((maxLat * 1) < (minLat * 1)) err.errors.lat = 'Invalid latitude parameters'

    const minLng = req.query.minLng || -180;
    const maxLng = req.query.maxLng || 180;
    if ((maxLng * 1) < (minLng * 1)) err.errors.lng = 'Invalid longitude parameters'

    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 1000000; // who would pay more than 1,000,000 per day?
    if (maxPrice < minPrice) err.errors.price = 'Invalid price parameters'

    let size = req.query.size || 20;
    if (size <= 0 || size > 20) size = 20;

    let page = req.query.page || 1;
    if (page <= 0 || page > 10) page = 10;

    const limit = size;
    const offset = (page - 1) * limit;

    if (Object.keys(err.errors).length) {
        next(err)
    } else {
        const filter = {
            where: {
                lat: {
                    [Op.between]: [minLat, maxLat]
                },
                lng: {
                    [Op.between]: [minLng, maxLng]
                },
                price: {
                    [Op.between]: [minPrice, maxPrice]
                }
            },
            limit,
            offset
        }

        req.queryFilter = filter;

        next();
    }
}

const queryFilter = [
    checkQuery,
    queryValidation
]

module.exports = {
    queryFilter
}
