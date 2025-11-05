const sequelize = require('../config/db');
const Project = require('./Project');
const Member = require('./Member');
const ProjectMembers = require('./ProjectMembers');
const RequestProjectData = require('./requestProjectData');

Project.belongsTo(RequestProjectData, { foreignKey: 'requestId' });

Project.belongsToMany(Member, {
  through: ProjectMembers,
  foreignKey: 'projectId',
  otherKey: 'memberId',
  as: 'members'
});

Member.belongsToMany(Project, {
  through: ProjectMembers,
  foreignKey: 'memberId',
  otherKey: 'projectId',
  as: 'projects'
});

module.exports = {
  sequelize,
  Project,
  Member,
  ProjectMembers,
  RequestProjectData
};
