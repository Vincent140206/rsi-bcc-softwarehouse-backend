const Payment = require('../models/Payment');
const RequestProjectData = require('../models/requestProjectData');
const cloudinary = require('../config/cloudinary');

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

    if(payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Tidak ada pembayaran ditemukan untuk user ini' });
    } 

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Error getPaymentsByUser:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pembayaran' });
  }
};

exports.uploadProof = async (req, res) => {
  try {
    const { requestId, uploadedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File bukti pembayaran wajib diunggah'
      });
    }

    if (!requestId) {
      await cloudinary.uploader.destroy(req.file.filename);
      
      return res.status(400).json({
        success: false,
        message: 'Request ID wajib diisi'
      });
    }

    const payment = await Payment.findOne({
      where: { requestId: requestId }
    });

    if (!payment) {
      await cloudinary.uploader.destroy(req.file.filename);
      
      return res.status(404).json({
        success: false,
        message: 'Payment belum dibuat untuk request ini. Pastikan project sudah di-approve terlebih dahulu.'
      });
    }

    if (payment.status === 'Verified') {
      await cloudinary.uploader.destroy(req.file.filename);
      
      return res.status(400).json({
        success: false,
        message: 'Payment sudah diverifikasi, tidak bisa diubah'
      });
    }

    if (payment.fileUrl) {
      try {
        const urlParts = payment.fileUrl.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const oldPublicId = `payment-proofs/${publicIdWithExt.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(oldPublicId);
        console.log('Old file deleted from cloudinary:', oldPublicId);
      } catch (deleteError) {
        console.error('Error deleting old file:', deleteError.message);
      }
    }

    payment.fileUrl = req.file.path;
    payment.uploadedBy = uploadedBy;
    payment.uploadedAt = new Date();
    payment.status = 'Pending';

    await payment.save();

    console.log('Payment proof uploaded - requestId:', requestId, 'cloudinary URL:', req.file.path);

    res.status(200).json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah',
      data: {
        paymentId: payment.paymentId,
        requestId: payment.requestId,
        fileUrl: payment.fileUrl,
        fileName: req.file.filename,
        fileSize: req.file.size,
        status: payment.status,
        uploadedBy: payment.uploadedBy,
        uploadedAt: payment.uploadedAt
      }
    });

  } catch (error) {
    console.error('Error uploadProof:', error);
    
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.error('Error deleting file after error:', deleteError.message);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengunggah bukti pembayaran',
      error: error.message 
    });
  }
};

exports.deleteProof = async (req, res) => {
  try {
    const { requestId } = req.params;

    const payment = await Payment.findOne({
      where: { requestId: requestId }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment tidak ditemukan'
      });
    }

    if (!payment.fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada file untuk dihapus'
      });
    }

    const urlParts = payment.fileUrl.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `payment-proofs/${publicIdWithExt.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);

    payment.fileUrl = null;
    payment.uploadedBy = null;
    payment.uploadedAt = null;
    payment.status = 'Pending';
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'File berhasil dihapus',
      data: payment
    });

  } catch (error) {
    console.error('Error deleteProof:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus file',
      error: error.message
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAndCountAll({
      include: [RequestProjectData],
      order: [['uploadedAt', 'DESC']]
    });

    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Tidak ada data pembayaran ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Data pembayaran berhasil diambil',
      data: payments
    });
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

exports.getPaymentByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const payment = await Payment.findOne({
      where: { requestId }
    });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error('Error getPaymentByRequestId:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pembayaran' });
  }
};