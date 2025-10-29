const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { uploadPaymentProof } = require('../middleware/upload');

router.get('/user/:userId', paymentController.getPaymentsByUser);

router.get('/all', paymentController.getAllPayments);
router.get('/:requestId', paymentController.getPaymentByRequestId);
router.put('/update-status/:paymentId', paymentController.updatePaymentStatus);

router.post('/upload-proof', 
  uploadPaymentProof.single('proof'),
  paymentController.uploadProof
);

router.delete('/:requestId/proof', paymentController.deleteProof);

module.exports = router;