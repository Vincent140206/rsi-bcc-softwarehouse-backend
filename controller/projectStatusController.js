const RequestProjectData = require('../models/requestProjectData');

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Declined', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    const project = await RequestProjectData.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    await project.update({ status });

    res.status(200).json({
      success: true,
      message: `Status project diubah menjadi ${status}`,
      data: project
    });
  } catch (error) {
    console.error('Error update status:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

exports.updateStatusInternal = async (projectId, status) => {
  try {
    const project = await RequestProjectData.findByPk(projectId);
    if (!project) throw new Error('Project tidak ditemukan');

    await project.update({ status });
    return true;
  } catch (error) {
    console.error('Gagal update status internal:', error);
    return false;
  }
};
