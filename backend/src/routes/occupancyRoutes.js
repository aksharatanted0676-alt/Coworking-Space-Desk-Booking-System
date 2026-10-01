const express = require('express');
const { getDailyOccupancy } = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getDailyOccupancy);

module.exports = router;
