const { pool } = require('../config/db');

// @desc    Get user profile
// @route   GET /api/profile/:id
// @access  Private (requires authentication)
const getUserProfile = async (req, res) => {
  const userId = req.params.id; // Get user ID from URL parameter

  try {
    const [users] = await pool.query('SELECT id, first_name, last_name, email, username, points, badges, role FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/:id
// @access  Private (requires authentication)
const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, phone_number, email, username } = req.body;

  // Ensure the authenticated user is updating their own profile
  if (req.user !== parseInt(userId)) {
    return res.status(403).json({ message: 'Not authorized to update this profile' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone_number = ?, email = ?, username = ? WHERE id = ?',
      [first_name, last_name, phone_number, email, username, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    const [updatedUser] = await pool.query('SELECT id, first_name, last_name, email, username, points, badges, role FROM users WHERE id = ?', [userId]);
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile };