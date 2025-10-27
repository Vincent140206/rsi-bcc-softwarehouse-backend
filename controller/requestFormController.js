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

module.exports = { submitRequest };