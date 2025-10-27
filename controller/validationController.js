function cekKelengkapanData(projectData) {
  const requiredFields = [
    'userId',
    'projectName',
    'projectDescription',
    'clientName',
    'budget',
    'deadline'
  ];

  for (let field of requiredFields) {
    if (!projectData[field] || projectData[field].toString().trim() === '') {
      return false;
    }
  }
  return true;
}

function cekFormatData(projectData) {
  if (isNaN(projectData.budget) || Number(projectData.budget) <= 0) {
    return false;
  }

  const date = new Date(projectData.deadline);
  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
}

function validateFormData(projectData) {
  if (!cekKelengkapanData(projectData)) {
    return { valid: false, message: 'Data tidak lengkap' };
  }

  if (!cekFormatData(projectData)) {
    return { valid: false, message: 'Format data salah' };
  }

  return { valid: true };
}

function tampilkanNotifikasiError(message, res) {
  return res.status(400).json({
    success: false,
    error: message
  });
}

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