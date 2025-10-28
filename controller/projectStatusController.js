const RequestProjectData = require('../models/requestProjectData');

exports.updateStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, analyzed_by, analysis_notes } = req.body;

    const project = await RequestProjectData.findByPk(requestId);
    if (!project)
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });

    project.status = status;
    project.analyzed_by = analyzed_by;
    project.analysis_notes = analysis_notes;
    await project.save();

    if (status === 'Approved') {
      await Payment.create({
        requestId: project.requestId,
        fileUrl: null,
        status: 'Pending'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status project diperbarui',
      data: project
    });
  } catch (error) {
    console.error('Error updateProjectStatus:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status project' });
  }
};