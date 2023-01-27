const { Op } = require('sequelize');

const queryFilter = (req, res, next) => {
    let size = req.query.size || 20;
    if (size <= 0 || size > 20) size = 20;

    let page = req.query.page || 1;
    if (page <= 0 || page > 10) page = 10;

    const limit = size;
    const offset = (page - 1) * limit;

    const minLat = req.query.minLat || -90;
    const maxLat = req.query.maxLat || 90;

    const minLng = req.query.minLng || -180;
    const maxLng = req.query.maxLng || 180;

    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 1000000; // who would pay more than 1,000,000 per day?

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

module.exports = {
    queryFilter
}
