const RequestProjectData = require('../models/requestProjectData');
const logActivity = require('../utils/logActivity');
const Payments = require('../models/Payment');

/* =========================
   Submit request project baru
   ========================= */
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

    // Log aktivitas
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

/* =========================
   Ambil semua request project
   ========================= */
async function getAllRequests(req, res) {
  try {
    const request = await RequestProjectData.findAndCountAll({
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Data request project berhasil diambil',
      data: request,
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

/* =========================
   Ambil detail project berdasarkan requestId
   ========================= */
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

/* =========================
   Ambil semua request project milik user tertentu
   ========================= */
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

/* =========================
   Ambil semua request dengan status Pending
   ========================= */
async function getAllPending(req, res) {
  try {
    const pendingRequests = await RequestProjectData.findAndCountAll({
      where: { status: 'Pending' },
    });
    return res.status(200).json({
      success: true,
      message: 'Data request project dengan status Pending berhasil diambil',
      data: pendingRequests
    });
  } catch (error) {
    logActivity('pending_requests_failed', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
}

/* =========================
   Ambil semua request dengan status Approved
   ========================= */
async function getAllApproved(req, res) {
  try {
    const approvedRequests = await RequestProjectData.findAndCountAll({
      where: { status: 'Approved' },
    });
    return res.status(200).json({
      success: true,
      message: 'Data request project dengan status Approved berhasil diambil',
      data: approvedRequests
    });
  } catch (error) {
    logActivity('approved_requests_failed', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
}

/* =========================
   Ambil semua request Approved yang belum ada bukti pembayaran
   ========================= */
async function getAllApprovedNullPayment(req, res) {
  try {
    const approvedNullPaymentRequests = await RequestProjectData.findAndCountAll({
      where: { status: 'Approved' },
      include: [
        {
          model: Payments,
          required: false,
          where: {
            fileUrl: null,
          },
        },
      ],
    });
    return res.status(200).json({
      success: true,
      message: 'Data request project dengan status Approved dan bukti pembayaran null berhasil diambil',
      count: approvedNullPaymentRequests.count,
      data: approvedNullPaymentRequests.rows
    });
  } catch (error) {
    logActivity('approved_null_payment_requests_failed', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
}

module.exports = { 
  submitRequest, 
  getAllRequests, 
  getProjectDetail, 
  getAllByUserId, 
  getAllPending, 
  getAllApproved, 
  getAllApprovedNullPayment 
};