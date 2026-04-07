const express = require('express');
const router = express.Router();
const { getDashboardStats, getRevenueReport, getAdsPerformance } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/revenue', protect, admin, getRevenueReport);
router.get('/performance', protect, admin, getAdsPerformance);

module.exports = router;
