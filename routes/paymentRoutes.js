const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.get('/user/:userId', paymentController.getPaymentsByUser);
router.post('/upload', paymentController.uploadProof);

router.get('/all', paymentController.getAllPayments);
router.put('/update-status/:paymentId', paymentController.updatePaymentStatus);

module.exports = router;