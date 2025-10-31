const sequelize = require('../config/db');
const RequestProjectData = require('../models/requestProjectData');
const Project = require('../models/Project');

exports.analyzeProject = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { requestId, analysis_notes, analyzed_by, decision } = req.body;

    if (!requestId || !decision) {
      return res.status(400).json({
        success: false,
        message: 'requestId dan decision wajib diisi'
      });
    }

    const request = await RequestProjectData.findByPk(requestId, { transaction });
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Project request tidak ditemukan'
      });
    }

    request.analysis_notes = analysis_notes || null;
    request.analyzed_by = analyzed_by || 'Project Leader';
    request.status = decision;
    await request.save({ transaction });

    let createdProject = null;

    if (decision.toLowerCase() === 'approved') {
      createdProject = await Project.create({
        name: request.projectName || `Project-${request.id}`,
        description: request.description || 'Tidak ada deskripsi',
        requestId: request.id 
      }, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: `Project telah dianalisis dan ${decision.toLowerCase()}`,
      projectRequest: request,
      createdProject: createdProject || null
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error saat analisis project:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat menganalisis project',
      error: error.message
    });
  }
};
