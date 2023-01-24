const router = require('express').Router();
const { Spot } = require('../../db/models');

// GET all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    res.json({ Spots: spots });
})

module.exports = router;
