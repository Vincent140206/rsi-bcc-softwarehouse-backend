const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.put('/:projectId/:progressId', projectController.updateProgress);
router.get('/:id', projectController.getProjectWithProgress);

module.exports = router;