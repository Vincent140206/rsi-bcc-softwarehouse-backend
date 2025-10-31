const { member } = require('../models');

exports.getMemberList = async (req, res) => {
    try {
        const members = await member.findAll({ where: { status: 'available' } });

        if (members.length === 0) {
            return res.status(404).json({ success: false, message: 'No available members found' });
        }
        
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};  