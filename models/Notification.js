const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Member = require('./Member');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  timestamps: true,
  tableName: 'notifications'
});

Notification.belongsTo(Member, { as: 'sender', foreignKey: 'senderId' });
Notification.belongsTo(Member, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Notification;