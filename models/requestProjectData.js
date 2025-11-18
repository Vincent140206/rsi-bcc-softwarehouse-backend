const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Payment = require('../models/Payment')

const RequestProjectData = sequelize.define('RequestProjectData', {
  requestId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  projectName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  projectDescription: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  clientName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  budget: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  analysis_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  analyzed_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
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

RequestProjectData.belongsTo(Payment, { foreignKey: 'requestId' });

module.exports = RequestProjectData;