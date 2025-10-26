const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, userType });

    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User Not Found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid Password' });

    const token = jwt.sign(
      { userId: user.userId, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login Succeeded', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not found' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = router;
