const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./Project');
const Member = require('./Member');

// Model Assignment → menyimpan penugasan member ke project tertentu
const Assignment = sequelize.define('Assignment', {

  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Foreign Key ke Project
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Foreign Key ke Member
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Role member di project (misal: developer, designer, tester)
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Status assignment (active / inactive)
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  }

}, {
  tableName: 'Assignments', // nama tabel
  timestamps: false         // nonaktifkan createdAt / updatedAt
});

// Relasi Assignment ↔ Project
// Setiap assignment terkait satu project
Assignment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Relasi Assignment ↔ Member
// Setiap assignment terkait satu member
Assignment.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

module.exports = Assignment;