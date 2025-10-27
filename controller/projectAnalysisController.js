const RequestProjectData = require('../models/requestProjectData');
const projectStatusController = require('./projectStatusController');

exports.analyzeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;

    if (!['Approved', 'Declined'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decision tidak valid' });
    }

    const project = await RequestProjectData.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    await project.update({
      analysis_notes: notes || null,
      analyzed_by: req.user?.id || null
    });

    await projectStatusController.updateStatusInternal(project.id, decision);

    res.status(200).json({
      success: true,
      message: `Analisis selesai, project ${decision.toLowerCase()}`,
      data: project
    });
  } catch (error) {
    console.error('Error pada analisis manual:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};
