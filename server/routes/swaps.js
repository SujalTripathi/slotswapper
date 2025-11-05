const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSwappableSlots,
  createSwapRequest,
  getMySwapRequests,
  respondToSwapRequest,
} = require('../controllers/swapController');

router.get('/swappable', protect, getSwappableSlots);
router.post('/request', protect, createSwapRequest);
router.get('/my-requests', protect, getMySwapRequests);
router.post('/respond/:id', protect, respondToSwapRequest);

module.exports = router;