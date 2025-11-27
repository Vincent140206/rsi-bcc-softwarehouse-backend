const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./Project');

// Model Progress → menyimpan setiap update progress untuk suatu project
const Progress = sequelize.define('Progress', {

  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Foreign Key ke Project
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project, // relasi ke tabel Project
      key: 'id'
    },
    onDelete: 'CASCADE',  // kalau project dihapus → progress ikut terhapus
    onUpdate: 'CASCADE'
  },

  // Judul progress update
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  // Deskripsi progress (opsional)
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Status progress (pending / done / in-progress)
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending'
  },

  // Tanggal update progress
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'Progress', // nama tabel di database
  timestamps: false       // disable createdAt / updatedAt otomatis
});

module.exports = Progress;