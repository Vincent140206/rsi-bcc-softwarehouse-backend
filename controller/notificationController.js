const Notification = require('../models/Notification');
const Member = require('../models/Member');

exports.sendNotification = async (req, res) => {
  try {
    const { senderId, receiverId, message, projectId, parentId } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'senderId, receiverId, dan message wajib diisi' });
    }

    const newNotif = await Notification.create({
      senderId,
      receiverId,
      projectId: projectId || null,
      parentId: parentId || null,
      message
    });

    res.status(201).json({ success: true, notification: newNotif });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ success: false, message: 'Gagal mengirim notifikasi' });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        { model: Member, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: Member, as: 'receiver', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
