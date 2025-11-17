const RequestProjectData = require('../models/requestProjectData');
const logActivity = require('../utils/logActivity');

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

    logActivity('request_created', {
      userId: projectData.userId,
      projectName: projectData.projectName
    });

    return res.status(201).json({
      success: true,
      message: 'Request berhasil disimpan',
      data: newRequest
    });
  } catch (error) {
    logActivity('request_create_failed', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server'
    });
  }
}

async function getAllRequests(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await RequestProjectData.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    logActivity('request_list_accessed', { page, limit });

    return res.status(200).json({
      success: true,
      message: 'Data request project berhasil diambil',
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    logActivity('request_list_failed', { error: error.message });
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
      logActivity('project_not_found', { requestId });
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    logActivity('project_detail_accessed', { requestId });

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    logActivity('project_detail_failed', { error: error.message });
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

async function getAllByUserId(req, res) {
  try {
    const { userId } = req.params;

    const requests = await RequestProjectData.findAll({
      where: { userId },
      order: [['created_at', 'DESC']]
    });

    if (requests.length === 0) {
      logActivity('user_requests_empty', { userId });
      return res.status(404).json({
        success: false,
        message: 'Tidak ada request project untuk user ini'
      });
    }

    logActivity('user_requests_accessed', { userId });

    return res.status(200).json({
      success: true,
      message: 'Data request project berhasil diambil',
      data: requests
    });
  } catch (error) {
    logActivity('user_requests_failed', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
}

module.exports = { submitRequest, getAllRequests, getProjectDetail, getAllByUserId };