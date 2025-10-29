const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.get('/user/:userId', paymentController.getPaymentsByUser);

router.get('/all', paymentController.getAllPayments);
router.put('/update-status/:paymentId', paymentController.updatePaymentStatus);

router.post('/upload-proof', 
  uploadPaymentProof.single('proof'),
  paymentController.uploadProof
);

router.delete('/:requestId/proof', paymentController.deleteProof);

module.exports = router;