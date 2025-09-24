const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);

module.exports = router;