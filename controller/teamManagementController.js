const Member = require('../models/Member');

// =========================
// Ambil daftar member yang tersedia
// =========================
exports.getMemberList = async (req, res) => {
  try {
    // Cari semua member dengan status "available", urut berdasarkan id ASC
    const members = await Member.findAndCountAll({
      where: { status: 'available' },
      order: [['id', 'ASC']]
    });

    // Jika tidak ada member yang tersedia, return 404
    if (members.count === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No available members found' 
      });
    }

    // Jika ada, kembalikan data member
    res.status(200).json({
      success: true,
      data: members
    });

  } catch (error) {
    // Tangani error server
    console.error('Error in getMemberList:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};