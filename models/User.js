const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  userType: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
