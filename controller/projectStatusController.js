const RequestProjectData = require('../models/requestProjectData');

exports.updateStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    const project = await RequestProjectData.findByPk(requestId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Status project diperbarui menjadi ${status}`,
      data: project
    });

  } catch (error) {
    console.error('Error update status:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};