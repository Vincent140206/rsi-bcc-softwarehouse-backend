const express = require('express');
const router = express.Router();

const TeamManagementController = require('../controllers/TeamManagementController');
const AssignmentController = require('../controllers/AssignmentController');
const NotificationController = require('../controllers/NotificationController');

router.get('/members', TeamManagementController.getMemberList);

router.post('/assign', AssignmentController.assignMembers);

router.get('/notifications/:memberId', NotificationController.getNotifications);

module.exports = router;