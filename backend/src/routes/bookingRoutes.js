const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Require authentication for all booking routes

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
