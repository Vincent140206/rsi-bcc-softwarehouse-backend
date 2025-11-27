const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { uploadPaymentProof } = require('../middleware/upload');

// Ambil semua pembayaran milik user tertentu
router.get('/user/:userId', paymentController.getPaymentsByUser);

// Ambil SEMUA data pembayaran (biasanya untuk admin/finance)
router.get('/all', paymentController.getAllPayments);

// Ambil pembayaran berdasarkan requestId (satu project saja)
router.get('/:requestId', paymentController.getPaymentByRequestId);

// Update status pembayaran (contoh: pending → success/failed)
router.put('/update-status/:paymentId', paymentController.updatePaymentStatus);

// Upload bukti pembayaran (gunakan middleware multer)
router.post(
  '/upload-proof',
  uploadPaymentProof.single('proof'),
  paymentController.uploadProof
);

// Hapus bukti pembayaran pada request tertentu
router.delete('/:requestId/proof', paymentController.deleteProof);

// Ambil project yang sudah APPROVED tapi BELUM ada pembayaran (cocok untuk dashboard finance)
router.get('/approved/pending', paymentController.getApprovedPendingPayments);

module.exports = router;