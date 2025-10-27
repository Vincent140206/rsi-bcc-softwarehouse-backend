const validationController = {
  validateFormData: (projectData) => {
    const kelengkapan = validationController.cekKelengkapanData(projectData);
    const format = validationController.cekFormatData(projectData);

    if (!kelengkapan) return { valid: false, message: "data tidak lengkap" };
    if (!format) return { valid: false, message: "format salah" };
    return { valid: true };
  },

  cekKelengkapanData: (data) => {
    return data.projectName && data.projectDescription && data.clientName && data.budget && data.deadline;
  },

  cekFormatData: (data) => {
    if (isNaN(data.budget)) return false;
    if (isNaN(Date.parse(data.deadline))) return false;
    return true;
  },

  tampilkanNotifikasiError: (msg, res) => {
    res.status(400).json({ success: false, message: msg });
  },

  tampilkanPesanGagalValidasi: (res) => {
    res.status(500).json({ success: false, message: "connection error" });
  }
};

module.exports = validationController;