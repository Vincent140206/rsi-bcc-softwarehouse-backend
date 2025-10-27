const RequestProjectData = require('../models/requestProjectData');
const projectStatusController = require('./projectStatusController');

exports.analyzeProject = async (req, res) => {
  try {
    const { requestId, analysis_notes, analyzed_by, decision } = req.body; 

    if (!requestId || !decision) {
      return res.status(400).json({
        success: false,
        message: 'requestId dan decision wajib diisi'
      });
    }

    const project = await RequestProjectData.findByPk(requestId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project request tidak ditemukan'
      });
    }

    project.analysis_notes = analysis_notes || null;
    project.analyzed_by = analyzed_by || 'Project Leader';
    project.status = decision;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project telah dianalisis dan ${decision.toLowerCase()}`,
      data: project
    });

  } catch (error) {
    console.error('Error saat analisis project:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

