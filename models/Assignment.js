module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projectId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'active' }
  });

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Project, { foreignKey: 'projectId' });
    Assignment.belongsTo(models.Member, { foreignKey: 'memberId' });
  };

  return Assignment;
};