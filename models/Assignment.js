const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Member = require('./Member');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Members',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Notifications',
  timestamps: false
});

Notification.belongsTo(Member, {
  foreignKey: 'memberId',
  targetKey: 'id',
  onDelete: 'CASCADE'
});

module.exports = Notification;