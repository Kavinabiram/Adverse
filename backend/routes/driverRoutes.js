const express = require('express');
const router = express.Router();
const { getDrivers, registerDriver, updateDriver, getDriverById } = require('../controllers/driverController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getDrivers)
    .post(protect, admin, registerDriver);

router.route('/:id')
    .get(protect, admin, getDriverById)
    .put(protect, admin, updateDriver);

module.exports = router;
