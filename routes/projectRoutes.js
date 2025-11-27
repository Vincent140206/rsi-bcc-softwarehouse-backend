const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

// update progress pada suatu project tertentu
router.put('/:projectId/progress', projectController.addProgress);

// Ambil detail 1 project lengkap dengan progress-nya
router.get('/:id', projectController.getProjectWithProgress);

// Ambil semua project yang ada di database (tanpa progress detail)
router.get('/', projectController.getAllProjects);

module.exports = router;