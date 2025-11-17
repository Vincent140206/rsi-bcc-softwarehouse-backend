const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/db");
const logger = require('./utils/logger');
require('dotenv').config();

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protected");
const requestRoutes = require('./routes/requestFormRoutes');
const projectAnalysisRoutes = require('./routes/projectAnalysisRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const assignMemberRoutes = require('./routes/assignMemberRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.authenticate()
  .then(() => console.log("Connected to MariaDB"))
  .catch((err) => console.error("Database connection error:", err));
  sequelize.sync({ alter: true })
  .then(() => console.log('All models synchronized with database'))
  .catch(err => console.error('Error syncing models:', err));

app.use('/rsi/api', require('./routes/testRoutes'));
app.use("/rsi/api/auth", authRoutes);
app.use("/rsi/api", protectedRoutes);
app.use('/rsi/api/request', requestRoutes);
app.use('/rsi/api/analysis', projectAnalysisRoutes);
app.use('/rsi/api/payment', paymentRoutes);
app.use('/rsi/api/assign', assignMemberRoutes);
app.use('/rsi/api/project', projectRoutes);

app.get('/rsi/', (req, res) => {
  res.send('Project Rekayasa Sistem Informasi');
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));