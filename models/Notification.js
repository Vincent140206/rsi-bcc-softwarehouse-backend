const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Member = require('./Member');
const Project = require('./Project');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

Notification.belongsTo(Member, {
  as: 'Sender',
  foreignKey: 'senderId',
  constraints: true,
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

Notification.belongsTo(Member, {
  as: 'Receiver',
  foreignKey: 'receiverId',
  constraints: true,
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

Notification.belongsTo(Project, {
  as: 'Project',
  foreignKey: 'projectId',
  constraints: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = Notification;
