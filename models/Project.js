const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RequestProjectData = require('./requestProjectData');
const Progress = require('./Progress');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'RequestProjectData',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'Projects',
  timestamps: false
});

Project.belongsTo(RequestProjectData, { foreignKey: 'requestId' });
Project.hasMany(Progress, { foreignKey: 'projectId', as: 'progressList' });

module.exports = Project;
