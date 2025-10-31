const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./Project');
const Member = require('./Member');

const ProjectMembers = sequelize.define('ProjectMembers', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Project,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Member,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'ProjectMembers',
  timestamps: false,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
  id: false
});

module.exports = ProjectMembers;
