const RequestProjectData = require('./requestProjectData');

exports.evaluateFeasibility = async (projectID) => {
  const project = await RequestProjectData.findByPk(projectID);

  if (!project) throw new Error('Project tidak ditemukan');

  const budget = project.budget;
  const timeLeft = (new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24);

  const isFeasible = budget > 10000 && timeLeft >= 7;

  return isFeasible;
};
