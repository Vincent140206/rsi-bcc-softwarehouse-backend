const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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

module.exports = RequestProjectData;