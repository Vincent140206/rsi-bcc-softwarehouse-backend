module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    projectId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    memberId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Member',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    role: { 
      type: DataTypes.STRING,
      allowNull: false 
    },
    status: { 
      type: DataTypes.STRING, 
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'Assignments',
    timestamps: false
  });

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Project, { 
      foreignKey: 'projectId',
      as: 'project'
    });
    Assignment.belongsTo(models.Member, { 
      foreignKey: 'memberId',
      as: 'member'
    });
  };

  return Assignment;
};