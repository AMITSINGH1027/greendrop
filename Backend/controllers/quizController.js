const { pool } = require('../config/db');

// @desc    Get all quiz questions
// @route   GET /api/quiz/questions
// @access  Public
const getQuizQuestions = async (req, res) => {
  try {
    const [questions] = await pool.query('SELECT id, question, option_a, option_b, option_c FROM quiz_questions');
    res.json(questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  const { answers } = req.body; // answers should be an array of { questionId: 1, selectedAnswer: 'a' }
  const userId = req.user; // From auth middleware

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: 'No answers provided' });
  }

  let score = 0;
  let totalQuestions = 0;

  try {
    const [allQuestions] = await pool.query('SELECT id, correct_answer, points FROM quiz_questions');
    const correctAnswersMap = new Map(allQuestions.map(q => [q.id, { answer: q.correct_answer, points: q.points }]));

    for (const userAnswer of answers) {
      const questionId = userAnswer.questionId;
      const selectedAnswer = userAnswer.selectedAnswer;

      if (correctAnswersMap.has(questionId)) {
        totalQuestions++;
        if (correctAnswersMap.get(questionId).answer === selectedAnswer) {
          score += correctAnswersMap.get(questionId).points;
        }
      }
    }

    // Save quiz attempt
    await pool.query(
      'INSERT INTO user_quiz_attempts (user_id, score, total_questions) VALUES (?, ?, ?)',
      [userId, score, totalQuestions]
    );

    // Update user's total points
    await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [score, userId]);

    res.status(200).json({
      message: 'Quiz submitted successfully!',
      score,
      totalQuestions,
      awardedPoints: score,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getQuizQuestions, submitQuiz };