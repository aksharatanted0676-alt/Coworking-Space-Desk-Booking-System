const express = require('express');
const {
  getAllDesks,
  getAvailableDesks,
  getDeskById,
  createDesk,
  updateDesk,
  deleteDesk
} = require('../controllers/deskController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/available', getAvailableDesks);
router.get('/', getAllDesks);
router.get('/:id', getDeskById);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), createDesk);
router.put('/:id', protect, authorize('admin'), updateDesk);
router.delete('/:id', protect, authorize('admin'), deleteDesk);

module.exports = router;
