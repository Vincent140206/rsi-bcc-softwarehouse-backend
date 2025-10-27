const express = require('express');
const router = express.Router();
const projectAnalysisController = require('../controller/projectAnalysisController');
const projectStatusController = require('../controller/projectStatusController'); 

router.post('/analyze/:projectID', projectAnalysisController.analyzeProject);
router.post('/form/analyze/:id', projectAnalysisController.analyzeProject);
router.post('/form/status/:id', projectStatusController.updateStatus);

module.exports = router;
