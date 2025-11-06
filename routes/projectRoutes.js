const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.put('/:id', progressController.updateProgress);
router.post('/:projectId/update', projectController.addProgress);

module.exports = router;