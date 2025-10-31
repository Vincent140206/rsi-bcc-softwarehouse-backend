const Notification = require('../models/Notification');
const Member = require('../models/Member');

exports.getNotifications = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const notifications = await Notification.findAll({ where: { memberId } }, { include: Member });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Error in getNotificationsForMember:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};