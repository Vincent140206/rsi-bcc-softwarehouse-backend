const sequelize = require('../config/db');
const Project = require('./Project');
const Member = require('./Member');
const ProjectMembers = require('./ProjectMembers');
const RequestProjectData = require('./requestProjectData');
const Progress = require('./Progress');
const Payment = require('./Payment');

/* =========================
   Relasi Project ↔ RequestProjectData
   ========================= */
// Satu Project berasal dari satu RequestProjectData
Project.belongsTo(RequestProjectData, { foreignKey: 'requestId' });

/* =========================
   Relasi Many-to-Many: Project ↔ Member
   ========================= */
// Satu project bisa punya banyak member
Project.belongsToMany(Member, {
  through: ProjectMembers,
  foreignKey: 'projectId',
  otherKey: 'memberId',
  as: 'members'   // alias untuk akses: project.getMembers()
});

// Satu member bisa diassign ke banyak project
Member.belongsToMany(Project, {
  through: ProjectMembers,
  foreignKey: 'memberId',
  otherKey: 'projectId',
  as: 'projects'  // alias untuk akses: member.getProjects()
});

/* =========================
   Relasi RequestProjectData ↔ Payment
   ========================= */
// Satu request bisa punya satu payment
RequestProjectData.hasOne(Payment, { foreignKey: 'requestId' });
Payment.belongsTo(RequestProjectData, { foreignKey: 'requestId' });

/* =========================
   Relasi Project ↔ Progress
   ========================= */
// Satu project bisa punya banyak progress
Project.hasMany(Progress, { foreignKey: 'projectId', as: 'progressList' });
Progress.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

/* =========================
   Export semua model & sequelize instance
   ========================= */
module.exports = {
  sequelize,
  Project,
  Member,
  ProjectMembers,
  RequestProjectData,
  Progress,
  Payment 
};