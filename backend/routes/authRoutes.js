const express = require('express');
const router = express.Router();
const { loginUser, getUserProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/change-password', protect, changePassword);

module.exports = router;
