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
    });x
  }
}

async function getAllRequests(req, res) {
  try {
    const requests = await RequestProjectData.findAll({
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Data request project berhasil diambil',
      data: requests
    });
  } catch (error) {
    console.error('Error mengambil data request:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
}

async function getProjectDetail(req, res) {
  try {
    const { requestId } = req.params;
    const project = await RequestProjectData.findByPk(requestId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Error mengambil detail project:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

async function getAllByUserId(req, res) {
  try {
    const { userId } = req.params;
    console.log('UserId dari params:', userId);

    const requests = await RequestProjectData.findAll({
      where: { userId },
      order: [['created_at', 'DESC']]
    });

    console.log('Jumlah hasil:', requests.length);
    console.log('Semua data:', JSON.stringify(requests, null, 2));

    return res.status(200).json({
      success: true,
      message: 'Data request project berhasil diambil',
      data: requests
    });
  } catch (error) {
    console.error('Error mengambil data request:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
}


module.exports = { submitRequest, getAllRequests, getProjectDetail, getAllByUserId };
