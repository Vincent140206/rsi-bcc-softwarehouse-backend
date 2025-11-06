const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.put('/:id', projectController.updateProgress);
router.get('/:id', projectController.getProjectWithProgress);

module.exports = router;