const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Model RequestProjectData → menyimpan data request project dari user
const RequestProjectData = sequelize.define('RequestProjectData', {

  // Primary key auto increment
  requestId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Foreign key: user yang membuat request
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Nama project
  projectName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // Deskripsi project
  projectDescription: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // Nama client
  clientName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // Budget project
  budget: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  // Deadline project
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },

  // Status request: pending / approved / rejected
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },

  // Catatan hasil analisis project
  analysis_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // ID analis yang memproses request
  analyzed_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Tanggal dibuat & diupdate (manual, karena timestamps: false)
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'RequestProjectData',
  timestamps: false
});

// Relasi dengan Payment
const Payment = require('../models/Payment');

// Satu request bisa punya satu payment (1:1)
RequestProjectData.belongsTo(Payment, { foreignKey: 'requestId' });

module.exports = RequestProjectData;