// =========================
// Cek kelengkapan field data project
// =========================
function cekKelengkapanData(projectData) {
  const requiredFields = [
    'userId',
    'projectName',
    'projectDescription',
    'clientName',
    'budget',
    'deadline'
  ];

  // Loop semua field wajib, return false jika ada yang kosong / null / whitespace
  for (let field of requiredFields) {
    if (!projectData[field] || projectData[field].toString().trim() === '') {
      return false;
    }
  }
  return true;
}

// =========================
// Cek format data project
// =========================
function cekFormatData(projectData) {
  // Budget harus number > 0
  if (isNaN(projectData.budget) || Number(projectData.budget) <= 0) {
    return false;
  }

  // Deadline harus tanggal valid
  const date = new Date(projectData.deadline);
  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
}

// =========================
// Fungsi utama validasi form
// =========================
function validateFormData(projectData) {
  if (!cekKelengkapanData(projectData)) {
    return { valid: false, message: 'Data tidak lengkap' };
  }

  if (!cekFormatData(projectData)) {
    return { valid: false, message: 'Format data salah' };
  }

  return { valid: true };
}

// =========================
// Tampilkan notifikasi error ke client (status 400)
// =========================
function tampilkanNotifikasiError(message, res) {
  return res.status(400).json({
    success: false,
    error: message
  });
}

// =========================
// Tampilkan error gagal validasi (status 500)
// =========================
function tampilkanPesanGagalValidasi(message, res) {
  return res.status(500).json({
    success: false,
    error: message || 'Gagal melakukan validasi data'
  });
}

module.exports = {
  validateFormData,
  tampilkanNotifikasiError,
  tampilkanPesanGagalValidasi,
};