const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validationController');
const requestFormController = require('../controllers/requestFormController');

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

module.exports = router;
