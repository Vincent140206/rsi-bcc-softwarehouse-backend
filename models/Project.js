const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Model Project → menyimpan data project yang dibuat berdasarkan request
const Project = sequelize.define('Project', {

  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  // Nama project
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  // Deskripsi project (opsional)
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Foreign Key ke RequestProjectData (bisa null)
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'RequestProjectData', // tabel target
      key: 'requestId'
    },
    onDelete: 'CASCADE',  // kalau request dihapus → project juga ikut
    onUpdate: 'CASCADE'
  }

}, {
  tableName: 'Projects',  // nama tabel di DB
  timestamps: false       // nonaktifkan createdAt / updatedAt
});

module.exports = Project;