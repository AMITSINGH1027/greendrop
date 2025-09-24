const express = require('express');
const router = express.Router();
const { getTrainingVideos, markVideoComplete, getCompletedVideos } = require('../controllers/trainingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/videos', getTrainingVideos);
router.post('/complete/:videoId', protect, markVideoComplete);
router.get('/completed/:userId', protect, getCompletedVideos);

module.exports = router;