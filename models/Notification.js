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
    allowNull: false,
    references: {
      model: Member,
      key: 'id'
    },
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    name: 'fk_notification_sender'
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Member,
      key: 'id'
    },
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    name: 'fk_notification_receiver'
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Project,
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
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
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;

Notification.belongsTo(Member, { as: 'sender', foreignKey: 'senderId' });
Notification.belongsTo(Member, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Notification;