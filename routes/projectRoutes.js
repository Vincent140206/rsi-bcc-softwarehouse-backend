const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.put('/:projectId/progress', projectController.addProgress);
router.get('/:id', projectController.getProjectWithProgress);
router.get('/', projectController.getAllProjects);

module.exports = router;