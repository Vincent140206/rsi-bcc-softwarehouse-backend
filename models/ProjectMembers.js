const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectMembers = sequelize.define('ProjectMembers', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Members',
      key: 'id'
    }
  }
}, {
  tableName: 'ProjectMembers',
  timestamps: false
});

module.exports = ProjectMembers;
