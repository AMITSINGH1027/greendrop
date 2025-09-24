const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/questions', getQuizQuestions);
router.post('/submit', protect, submitQuiz);

module.exports = router;