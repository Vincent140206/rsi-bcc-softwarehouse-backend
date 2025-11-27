const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RequestProjectData = require('./requestProjectData');

// Model Payment → menyimpan data pembayaran untuk tiap request project
const Payment = sequelize.define('Payment', {

  // Primary Key
  paymentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  // Foreign Key ke RequestProjectData
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RequestProjectData', // tabel target
      key: 'requestId'
    }
  },

  // URL file bukti pembayaran
  fileUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  // Status pembayaran: Pending / Verified / Rejected
  status: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false
  },

  // ID user yang mengupload bukti
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Waktu upload bukti
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  // ID user yang memvalidasi pembayaran
  validatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Waktu validasi pembayaran
  validatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'Payments',  // nama tabel di DB
  timestamps: false       // disable createdAt / updatedAt otomatis
});

// Relasi Payment → RequestProjectData
Payment.belongsTo(RequestProjectData, { 
  foreignKey: 'requestId', 
  targetKey: 'requestId',
  onDelete: 'CASCADE'      // jika request dihapus → payment ikut terhapus
});

module.exports = Payment;