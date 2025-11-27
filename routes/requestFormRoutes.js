const express = require('express');
const router = express.Router();

const validationController = require('../controller/validationController');
const requestFormController = require('../controller/requestFormController');


// GET /form – hanya untuk testing endpoint / cek koneksi
router.get('/form', (req, res) => {
  res.status(200).json({ message: 'Form ditampilkan' });
});


// POST /form/input – menerima input tapi belum masuk database (dummy response)
router.post('/form/input', (req, res) => {
  res.status(200).json({ message: 'Data tersimpan di form', data: req.body });
});


// POST /form/submit – endpoin utama (validasi + simpan ke database)
router.post('/form/submit', async (req, res) => {
  const projectData = req.body; // ambil data dari body

  // validasi dulu sebelum simpan
  const validationResult = validationController.validateFormData(projectData);

  // jika tidak valid, langsung kirim error & hentikan alur
  if (!validationResult.valid) {
    return validationController.tampilkanNotifikasiError(validationResult.message, res);
  }

  // jika valid → simpan ke database lewat controller
  await requestFormController.submitRequest(projectData, res);
});

// GET /form/data – ambil semua data request dari database
router.get('/form/data', requestFormController.getAllRequests);

// GET /form/:requestId – ambil data detail berdasarkan ID
router.get('/form/:requestId', requestFormController.getProjectDetail);

// GET /form/user/:userId – ambil semua request milik user tertentu
router.get('/form/user/:userId', requestFormController.getAllByUserId);

// GET /form/status/pending – ambil semua request yang statusnya pending
router.get('/form/status/pending', requestFormController.getAllPending);

// GET /form/status/approved – ambil semua request yang sudah approved oleh analis
router.get('/form/status/approved', requestFormController.getAllApproved);

// GET /form/status/approved/null-payment – ambil data approved tapi belum ada payment
router.get('/form/status/approved/null-payment', requestFormController.getAllApprovedNullPayment);

module.exports = router;