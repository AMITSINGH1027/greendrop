const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { first_name, last_name, phone_number, username, email, password, role } = req.body;

  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with that username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, phone_number, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, phone_number, username, email, hashedPassword, role || 'user']
    );

    const newUser = {
      id: result.insertId,
      first_name,
      last_name,
      phone_number,
      username,
      email,
      role: role || 'user',
      points: 0,
      badges: 0,
      token: generateToken(result.insertId),
    };

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      role: user.role,
      points: user.points,
      badges: user.badges,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };