const express = require('express');
const router = express.Router();
const projectAnalysisController = require('../controller/projectAnalysisController');

router.post('/analyze/:projectID', projectAnalysisController.analyzeProject);
router.post('/form/analyze/:id', projectAnalysisController.analyzeProject);
router.post('/form/status/:id', projectStatusController.updateStatus);

module.exports = router;
