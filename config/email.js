const nodemailer = require('nodemailer');

// Konfigurasi transporter nodemailer menggunakan Gmail service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fungsi untuk mengirim email notifikasi update progress request/analisis
async function kirimEmailAnalisis(targetEmail, requestId, keputusan, title, description) {
  const mailOptions = {
    from: '"RSI System" <no-reply@rsi-bcc.com>',
    to: targetEmail,
    subject: `Update Progress Request #${requestId}`,
    html: `
      <h3>Update Progress Request #${requestId}</h3>
      <p><strong>Status:</strong> ${keputusan}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p>Terima kasih telah menggunakan BCC Software House.</p>
    `,
  };

  try {
    // Kirim email menggunakan transporter
    await transporter.sendMail(mailOptions);
    console.log(`Email analisis untuk request ${requestId} terkirim ke ${targetEmail}`);
  } catch (error) {
    console.error('Gagal mengirim email:', error);
  }
}

module.exports = { transporter, kirimEmailAnalisis };