const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RequestProjectData = require('./models/RequestProjectData');
const Member = require('./Member');

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
    allowNull: false,
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

Project.belongsToMany(Member, {
  through: 'ProjectMembers',
  foreignKey: 'projectId',
  otherKey: 'memberId'
});

module.exports = Project;
