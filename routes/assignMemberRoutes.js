const express = require('express');
const router = express.Router();

const TeamManagementController = require('../controller/teamManagementController');
const AssignmentController = require('../controller/assignmentController');
const NotificationController = require('../controller/notificationController');

router.get('/members', TeamManagementController.getMemberList);

router.post('/', AssignmentController.assignMembers);

router.get('/notifications/:memberId', NotificationController.getNotifications);

module.exports = router;