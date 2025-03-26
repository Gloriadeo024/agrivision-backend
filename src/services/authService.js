// backend/src/services/authService.js - Handles user authentication and authorization

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRY } = process.env;

// Register a new user
const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const user = await User.create({ ...userData, password: hashedPassword });
  return user;
};

// Authenticate user and generate token
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  return { user, token };
};

module.exports = { registerUser, loginUser };
