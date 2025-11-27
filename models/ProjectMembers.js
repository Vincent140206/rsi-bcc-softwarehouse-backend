const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./Project');
const Member = require('./Member');

// Model ProjectMembers → tabel relasi many-to-many antara Project & Member
const ProjectMembers = sequelize.define('ProjectMembers', {

  // Foreign key ke Project
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // gabungan primary key: projectId + memberId
    references: {
      model: Project, // relasi ke tabel Project
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },

  // Foreign key ke Member
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // gabungan primary key: projectId + memberId
    references: {
      model: Member, // relasi ke tabel Member
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }

}, {
  tableName: 'ProjectMembers', // nama tabel di database
  timestamps: false,            // nonaktifkan createdAt / updatedAt
  freezeTableName: true,        // jangan otomatis plural
  id: false                     // tidak ada primary key auto-increment tunggal
});

module.exports = ProjectMembers;