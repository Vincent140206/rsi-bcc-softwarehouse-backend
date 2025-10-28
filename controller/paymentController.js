const Payment = require('../models/Payment');
const RequestProjectData = require('../models/requestProjectData');

exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.findAll({
      include: [{
        model: RequestProjectData,
        where: { userId },
      }],
      order: [['uploadedAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Error getPaymentsByUser:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pembayaran' });
  }
};

exports.uploadProof = async (req, res) => {
  try {
    const { requestId, uploadedBy, fileUrl } = req.body;

    const payment = await Payment.create({
      requestId,
      uploadedBy,
      fileUrl,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah',
      data: payment
    });
  } catch (error) {
    console.error('Error uploadProof:', error);
    res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran' });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [RequestProjectData],
      order: [['uploadedAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Error getAllPayments:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pembayaran' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, validatedBy } = req.body;

    const payment = await Payment.findByPk(paymentId);
    if (!payment)
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });

    payment.status = status;
    payment.validatedBy = validatedBy;
    payment.validatedAt = new Date();

    await payment.save();

    res.status(200).json({ success: true, message: 'Status pembayaran diperbarui', data: payment });
  } catch (error) {
    console.error('Error updatePaymentStatus:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pembayaran' });
  }
};