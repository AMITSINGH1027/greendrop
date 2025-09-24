const { pool } = require('../config/db');

// @desc    Get all training videos
// @route   GET /api/training/videos
// @access  Public
const getTrainingVideos = async (req, res) => {
  try {
    const [videos] = await pool.query('SELECT * FROM training_videos');
    res.json(videos);
  } catch (error) {
    console.error('Error fetching training videos:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark a training video as complete for a user
// @route   POST /api/training/complete/:videoId
// @access  Private
const markVideoComplete = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user; // From auth middleware

  try {
    // Check if video exists
    const [video] = await pool.query('SELECT * FROM training_videos WHERE id = ?', [videoId]);
    if (video.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if user has already completed this video
    const [existingCompletion] = await pool.query(
      'SELECT * FROM user_completed_videos WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );

    if (existingCompletion.length > 0) {
      return res.status(400).json({ message: 'Video already marked as complete' });
    }

    // Mark video as complete
    await pool.query(
      'INSERT INTO user_completed_videos (user_id, video_id) VALUES (?, ?)',
      [userId, videoId]
    );

    // Add points to user
    const pointsToAdd = video[0].points_on_completion || 10; // Default to 10 if not set
    await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [pointsToAdd, userId]);

    res.status(200).json({ message: 'Video marked as complete and points awarded!' });
  } catch (error) {
    console.error('Error marking video complete:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get completed videos for a user
// @route   GET /api/training/completed/:userId
// @access  Private
const getCompletedVideos = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [completedVideos] = await pool.query(
      'SELECT tv.id, tv.title, tv.youtube_id, tv.description, ucv.completed_at FROM user_completed_videos ucv JOIN training_videos tv ON ucv.video_id = tv.id WHERE ucv.user_id = ?',
      [userId]
    );
    res.json(completedVideos);
  } catch (error) {
    console.error('Error fetching completed videos:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getTrainingVideos, markVideoComplete, getCompletedVideos };