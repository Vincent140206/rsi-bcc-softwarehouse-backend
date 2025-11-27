const sequelize = require('../config/db');
const RequestProjectData = require('../models/requestProjectData');
const Project = require('../models/Project');

/* =========================
   Menganalisis project request
   - Memutuskan apakah project disetujui (approved) atau ditolak
   - Jika approved, otomatis membuat record Project baru
   - Menggunakan transaction agar perubahan konsisten
   ========================= */
exports.analyzeProject = async (req, res) => {
  const transaction = await sequelize.transaction(); // Mulai transaction

  try {
    const { requestId, analysis_notes, analyzed_by, decision } = req.body;

    // Validasi input wajib
    if (!requestId || !decision) {
      return res.status(400).json({
        success: false,
        message: 'requestId dan decision wajib diisi'
      });
    }

    // Ambil request project berdasarkan requestId
    const request = await RequestProjectData.findByPk(requestId, { transaction });
    if (!request) {
      await transaction.rollback(); // rollback jika request tidak ditemukan
      return res.status(404).json({
        success: false,
        message: 'Project request tidak ditemukan'
      });
    }

    // Update data analisis
    request.analysis_notes = analysis_notes || null;
    request.analyzed_by = analyzed_by || 'Project Leader';
    request.status = decision;
    await request.save({ transaction });

    let createdProject = null;

    // Jika project disetujui, buat record Project baru
    if (decision.toLowerCase() === 'approved') {
      createdProject = await Project.create({
        name: request.projectName || `Project-${request.id}`,
        description: request.projectDescription || 'Tidak ada deskripsi',
        requestId: request.requestId,
      }, { transaction });
    }

    await transaction.commit(); // commit semua perubahan

    // Kirim response sukses
    res.status(200).json({
      success: true,
      message: `Project telah dianalisis dan ${decision.toLowerCase()}`,
      projectRequest: request,
      createdProject: createdProject || null
    });

  } catch (error) {
    await transaction.rollback(); // rollback jika terjadi error
    console.error('Error saat analisis project:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat menganalisis project',
      error: error.message
    });
  }
};