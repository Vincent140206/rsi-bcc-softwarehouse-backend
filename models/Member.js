module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'available' }
  });
  return Member;
};