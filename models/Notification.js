const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Member = require('./Member');
const Project = require('./Project');

// Model Notification → menyimpan notifikasi antar member, bisa terkait project
const Notification = sequelize.define('Notification', {

  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  // ID pengirim (FK ke Member)
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // ID penerima (FK ke Member)
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // ID project terkait notifikasi (opsional)
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Isi pesan notifikasi
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // Status baca
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // ID notifikasi parent (jika ini reply / thread)
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }

}, {
  tableName: 'notifications', // nama tabel
  timestamps: true            // otomatis createdAt & updatedAt
});

// Relasi Notification → Member
// Sender
Notification.belongsTo(Member, {
  as: 'Sender',         // alias relasi
  foreignKey: 'senderId',
  constraints: true,
  onDelete: 'NO ACTION',  // jangan hapus notification saat sender dihapus
  onUpdate: 'CASCADE'
});

// Receiver
Notification.belongsTo(Member, {
  as: 'Receiver',       // alias relasi
  foreignKey: 'receiverId',
  constraints: true,
  onDelete: 'NO ACTION', // jangan hapus notification saat receiver dihapus
  onUpdate: 'CASCADE'
});

// Relasi ke Project (opsional)
Notification.belongsTo(Project, {
  as: 'Project',
  foreignKey: 'projectId',
  constraints: true,
  onDelete: 'SET NULL', // project dihapus → projectId di notification jadi NULL
  onUpdate: 'CASCADE'
});

module.exports = Notification;