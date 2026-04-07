const express = require('express');
const router = express.Router();
const { getAds, createAd, updateAd, deleteAd } = require('../controllers/adsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, admin, getAds)
    .post(protect, admin, upload.single('media'), createAd);

router.route('/:id')
    .put(protect, admin, upload.single('media'), updateAd)
    .delete(protect, admin, deleteAd);

module.exports = router;
