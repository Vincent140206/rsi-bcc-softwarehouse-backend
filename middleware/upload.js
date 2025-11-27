const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/* =========================
   Konfigurasi CloudinaryStorage
   ========================= */
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary, // instance cloudinary
  params: {
    folder: 'payment-proofs', // folder tempat file disimpan
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], // format file yang diperbolehkan
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // resize maksimal
    public_id: (req, file) => {
      // Nama file: proof-{requestId}-{timestamp}
      const requestId = req.body.requestId || 'unknown';
      const timestamp = Date.now();
      return `proof-${requestId}-${timestamp}`;
    }
  }
});

/* =========================
   Middleware Multer
   ========================= */
const uploadPaymentProof = multer({
  storage: paymentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // maksimal 5MB
  },
  fileFilter: (req, file, cb) => {
    // Hanya izinkan tipe file tertentu
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // file valid → lanjut
    } else {
      cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF'), false); // file invalid → error
    }
  }
});

module.exports = { uploadPaymentProof };