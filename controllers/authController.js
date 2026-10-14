const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

  const user = await User.findByUsername(username);
  console.log("1. User object eka:", user);
console.log("2. JWT Secret eka:", process.env.JWT_SECRET);
  if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

  const match = await bcrypt.compare(password, user.password_hash);
  console.log("User input password:", password);
console.log("DB hash:", user.password_hash);
console.log("Match result:", match);
  if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Login successful', token, role: user.role, username: user.username });
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required.' });
  const hash = await bcrypt.hash(password, 10);
  const id = await User.create(username, email, hash, role || 'admin');
  res.json({ message: 'User registered', id });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  req.session?.destroy?.();
  res.json({ message: 'Logged out' });
};

exports.me = (req, res) => {
  res.json({ user: req.user });
};