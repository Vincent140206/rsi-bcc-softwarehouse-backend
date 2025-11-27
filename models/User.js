const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definisi model User
const User = sequelize.define('User', {

  // Primary Key, auto increment
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Nama user, wajib diisi
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // Email user, wajib, harus unik
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'Email must be unique'
    }
  },

  // Password user (hashed)
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  // Tipe user: admin atau user, default = user
  userType: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },

  // Nomor telepon (opsional)
  phone: {
    type: DataTypes.STRING(20)
  },

  // Status aktif user, default = true
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  // Opsi timestamps
  timestamps: true,
  createdAt: 'created_at',   // kolom dibuat otomatis saat create
  updatedAt: 'updated_at'    // kolom dibuat otomatis saat update
});

module.exports = User;