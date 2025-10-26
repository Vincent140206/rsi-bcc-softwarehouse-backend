const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { name, email, password, userType, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType: userType || 'user',
      phone
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        userType: user.userType
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};