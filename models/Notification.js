module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    memberId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.Member, { foreignKey: 'memberId' });
  };

  return Notification;
};