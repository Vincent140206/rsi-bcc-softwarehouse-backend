const express = require('express');
const router = express.Router();

const TeamManagementController = require('../controllers/teamManagementController');
const AssignmentController = require('../controllers/assignmentController');
const NotificationController = require('../controllers/notificationController');

router.get('/members', TeamManagementController.getMemberList);

router.post('/', AssignmentController.assignMembers);

router.get('/notifications/:memberId', NotificationController.getNotifications);

module.exports = router;