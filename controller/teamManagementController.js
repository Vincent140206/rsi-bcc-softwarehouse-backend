const Member = require('../models/Member');

exports.getMemberList = async (req, res) => {
  try {
    const members = await Member.findAll({ where: { status: 'Available' } });
    if (members.length === 0) {
      return res.status(404).json({ success: false, message: 'No available members found' });
    }
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    console.error('Error in getMemberList:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};