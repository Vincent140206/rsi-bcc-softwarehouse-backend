const RequestProjectData = require('../models/requestProjectData');

async function submitRequest(projectData, res) {
  try {
    const newRequest = await RequestProjectData.create({
      userId: projectData.userId,
      projectName: projectData.projectName,
      projectDescription: projectData.projectDescription,
      clientName: projectData.clientName,
      budget: projectData.budget,
      deadline: projectData.deadline,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Request berhasil disimpan',
      data: newRequest
    });
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server'
    });
  }
}

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RequestProject.findAll({
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Data request project berhasil diambil',
      data: requests
    });
  } catch (error) {
    console.error('Error mengambil data request:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

module.exports = { submitRequest, getAllRequests };