const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const driverRoutes = require('./routes/driverRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adsRoutes = require('./routes/adsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/reports', reportRoutes);

// Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
