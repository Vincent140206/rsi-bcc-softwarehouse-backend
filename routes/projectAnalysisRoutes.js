const express = require('express');
const router = express.Router();
const projectAnalysisController = require('../controller/projectAnalysisController');
const projectStatusController = require('../controller/projectStatusController');

// Analisis project (misal: oleh analis) setelah request diterima
router.post('/analyze', projectAnalysisController.analyzeProject);

// Update status project (pending → approved / rejected, dsb)
router.post('/form/status/:id', projectStatusController.updateStatus);

module.exports = router;