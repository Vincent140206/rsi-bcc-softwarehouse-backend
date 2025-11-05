const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./Project');
const Member = require('./Member');

const Assignment = sequelize.define('Assignment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  memberId: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' }
}, {
  tableName: 'Assignments',
  timestamps: false
});


Assignment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Assignment.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

module.exports = Assignment;