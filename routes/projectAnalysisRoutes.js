const express = require('express');
const router = express.Router();
const projectAnalysisController = require('../controllers/projectAnalysisController');

router.post('/analyze/:projectID', projectAnalysisController.analyzeProject);

module.exports = router;
