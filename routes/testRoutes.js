const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

router.post('/test-payment', async (req, res) => {
  try {
    const payment = await Payment.create({
      requestId: 1,
      fileUrl: null,
      status: 'Pending'
    });
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error('Error create payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
