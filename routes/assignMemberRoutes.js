const express = require('express');
const router = express.Router();
const TeamManagementController = require('../controller/teamManagementController');
const AssignmentController = require('../controller/assignmentController');
const NotificationController = require('../controller/notificationController');

// Ambil daftar semua member (untuk admin / manager)
router.get('/members', TeamManagementController.getMemberList);

// Assign satu atau beberapa member ke project tertentu
router.post('/', AssignmentController.assignMembers);

// Ambil semua project yang sedang atau pernah dikerjakan oleh member tertentu
router.get('/members/:memberId/projects', AssignmentController.getMemberProjects);

// Ambil semua member yang sudah diassign ke project tertentu
router.get('/:projectId/members', AssignmentController.getAssignedMembers);

module.exports = router;