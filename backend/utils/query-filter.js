const { Op } = require('sequelize');

const queryFilter = (req, res, next) => {
    const err = new Error('Invalid Search Filters')
    err.status = 400;
    err.errors = {}


    const minLat = req.query.minLat || -90;
    if (minLat < -90 || minLat > 90 || Number.isNaN(minLat * 1)) err.errors.minLat = 'Invalid Minimum Latitude Parameter'
    const maxLat = req.query.maxLat || 90;
    console.log(maxLat * 1);
    if (maxLat < -90 || maxLat > 90 || Number.isNaN(maxLat * 1) || maxLat < minLat) err.errors.maxLat = 'Invalid Maximum Latitude Parameter'

    const minLng = req.query.minLng || -180;
    if (minLng < -180 || minLng > 180 || Number.isNaN(minLng * 1)) err.errors.minLng = 'Invalid Minimum Longitude Parameter'
    const maxLng = req.query.maxLng || 180;
    if (maxLng < -180 || maxLng > 180 || Number.isNaN(maxLng * 1) || maxLng < minLng) err.errors.maxLng = 'Invalid Maximum Longitude Parameter'

    const minPrice = req.query.minPrice || 0;
    if (minPrice < 0 || Number.isNaN(minPrice * 1)) err.errors.minPrice = 'Invalid Minimum Price Parameter'
    const maxPrice = req.query.maxPrice || 1000000; // who would pay more than 1,000,000 per day?
    if (maxPrice < 0 || maxPrice < minPrice || Number.isNaN(maxPrice * 1)) err.errors.maxPrice = 'Invalid Maximum Price Parameter'

    let size = req.query.size || 20;
    if (size <= 0 || size > 20) size = 20;
    if (Number.isNaN(size * 1)) err.errors.size = 'Size Paramter Must Be a Number'

    let page = req.query.page || 1;
    if (page <= 0 || page > 10) page = 10;
    if (Number.isNaN(page * 1)) err.errors.page = 'Page Parameter Must Be a Number'

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

module.exports = {
    queryFilter
}
