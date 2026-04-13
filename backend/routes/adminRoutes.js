const express = require('express');
const adminController = require('../controllers/adminController');
const { upload } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Driver Management
router.post('/drivers', adminController.createDriver);
router.get('/drivers', adminController.getDrivers);

// Tablet Management
router.post('/tablets', adminController.enrollTablet);
router.post('/tablets/assign', adminController.assignTablet);
router.patch('/tablets/status', adminController.updateTabletStatus);

// Ad Management
router.post('/ads', protect, admin, upload.single('media'), adminController.createAd);

module.exports = router;
