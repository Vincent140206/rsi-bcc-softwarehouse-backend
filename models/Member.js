const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Model Member → menyimpan data anggota tim yang bisa diassign ke project
const Member = sequelize.define('Member', {

  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  // Nama member
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  // Role / jabatan member
  role: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  // Status member: available / busy / inactive
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'available',
    allowNull: false
  },

  // Email member, wajib unik dan valid format email
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  }

}, {
  tableName: 'Member', // nama tabel di DB
  timestamps: false     // nonaktifkan createdAt / updatedAt
});

module.exports = Member;