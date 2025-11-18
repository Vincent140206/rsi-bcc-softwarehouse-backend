const express = require('express');
const router = express.Router();
const validationController = require('../controller/validationController');
const requestFormController = require('../controller/requestFormController');

router.get('/form', (req, res) => {
  res.status(200).json({ message: 'Form ditampilkan' });
});

router.post('/form/input', (req, res) => {
  res.status(200).json({ message: 'Data tersimpan di form', data: req.body });
});

router.post('/form/submit', async (req, res) => {
  const projectData = req.body;

  const validationResult = validationController.validateFormData(projectData);

  if (!validationResult.valid) {
    return validationController.tampilkanNotifikasiError(validationResult.message, res);
  }

  await requestFormController.submitRequest(projectData, res);
});

router.get('/form/data', requestFormController.getAllRequests);
router.get('/form/:requestId', requestFormController.getProjectDetail);
router.get('/form/user/:userId', requestFormController.getAllByUserId);
router.get('/form/status/pending', requestFormController.getAllPending);

module.exports = router;
