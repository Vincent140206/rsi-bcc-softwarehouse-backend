const Member = require('../models/Member');

exports.getMemberList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: members } = await Member.findAndCountAll({
      where: { status: 'Available' },
      limit,
      offset,
      order: [['createdAt', 'ASC']]
    });

    if (members.length === 0) {
      return res.status(404).json({ success: false, message: 'No available members found' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Available members retrieved successfully',
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: members 
    });
  } catch (error) {
    console.error('Error in getMemberList:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};