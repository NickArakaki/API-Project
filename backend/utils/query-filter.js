const { Op } = require('sequelize');

const queryFilter = (req, res, next) => {
    const err = new Error('Invalid Search Filters')
    err.status = 400;
    err.errors = {}

    let size = req.query.size || 20;
    if (size <= 0 || size > 20) size = 20;

    let page = req.query.page || 1;
    if (page <= 0 || page > 10) page = 10;

    const limit = size;
    const offset = (page - 1) * limit;

    const minLat = req.query.minLat || -90;
    const maxLat = req.query.maxLat || 90;
    if (minLat > maxLat) err.errors.lat = 'Minimum Latitude Must Be Less Than or Equal to Maximum Latitude';

    const minLng = req.query.minLng || -180;
    const maxLng = req.query.maxLng || 180;
    if (minLng > maxLng) err.errors.lng = 'Minimum Longitude Must Be Less Than or Equal to Minimum Longitude';

    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 1000000; // who would pay more than 1,000,000 per day?
    if (minPrice > maxPrice) err.errors.price = 'Minimum Price Must Be Less Than or Equal to Maximum Price'

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

module.exports = {
    queryFilter
}
