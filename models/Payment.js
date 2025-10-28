const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RequestProjectData = require('./requestProjectData');

const Payment = sequelize.define('Payment', {
  paymentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RequestProjectData,
      key: 'requestId'
    }
  },
  fileUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Pending'
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  validatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  validatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Payments',
  timestamps: false
});

Payment.belongsTo(RequestProjectData, { foreignKey: 'requestId' });

module.exports = Payment;
