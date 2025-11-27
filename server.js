// Import module express untuk membuat server dan routing
const express = require("express");

// Import dotenv untuk membaca variabel dari file .env
const dotenv = require("dotenv");

// Import cors agar API bisa diakses dari frontend beda domain
const cors = require("cors");

// Import konfigurasi database Sequelize
const sequelize = require("./config/db");

// Import custom logger (biasanya utk simpan log ke file)
const logger = require('./utils/logger');

// Memuat variabel environment dari .env
require('dotenv').config();

dotenv.config(); // (sebenarnya ini redundant, karena atas sudah ada)

// Import file route berbagai fitur backend
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protected");
const requestRoutes = require('./routes/requestFormRoutes');
const projectAnalysisRoutes = require('./routes/projectAnalysisRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const assignMemberRoutes = require('./routes/assignMemberRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Membuat instance express
const app = express();

// Mengaktifkan CORS agar bisa diakses dari client (React, Flutter, dsb)
app.use(cors());

// Agar server bisa membaca request body dengan format JSON
app.use(express.json());

// Agar bisa membaca data form (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Cek koneksi database MariaDB
sequelize.authenticate()
  .then(() => console.log("Connected to MariaDB"))
  .catch((err) => console.error("Database connection error:", err));

// Sync semua model dengan database (alter = update jika ada perubahan struktur tabel)
sequelize.sync({ alter: true })
  .then(() => console.log('All models synchronized with database'))
  .catch(err => console.error('Error syncing models:', err));

// Daftar route utama (prefix rsi/api)
app.use('/rsi/api', require('./routes/testRoutes')); // route untuk testing
app.use("/rsi/api/auth", authRoutes); // route untuk login/register
app.use("/rsi/api", protectedRoutes); // route yang perlu token (middleware)
app.use('/rsi/api/request', requestRoutes); // form request project
app.use('/rsi/api/analysis', projectAnalysisRoutes); // analisis project
app.use('/rsi/api/payment', paymentRoutes); // handling payment
app.use('/rsi/api/assign', assignMemberRoutes); // assign anggota ke project
app.use('/rsi/api/project', projectRoutes); // CRUD project

// Endpoint root (tanpa /api), hanya untuk testing server berjalan
app.get('/rsi/', (req, res) => {
  res.send('Project Rekayasa Sistem Informasi');
});

// Global error handler – kalau ada error di middleware lain
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Logger request masuk (method, url, body, query)
app.use((req, res, next) => {
  logger.info({
    message: 'incoming_request',
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query
  });
  next();
});

// Jalankan server di port dari .env atau default 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));