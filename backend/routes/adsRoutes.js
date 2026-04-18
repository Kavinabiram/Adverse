const express = require('express');
const router = express.Router();
const { getAds, getAdById, createAd, updateAd, deleteAd, uploadVideo, updateThumbnail, uploadCustomThumbnail } = require('../controllers/adsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getAds)
    .post(protect, admin, createAd);

router.post('/upload-video', protect, admin, upload.single('video'), uploadVideo);
router.post('/upload-thumbnail', protect, admin, upload.single('thumbnail'), uploadCustomThumbnail);
router.post('/update-thumbnail', protect, admin, upload.single('thumbnail'), updateThumbnail);

router.route('/:id')
    .get(protect, admin, getAdById)
    .put(protect, admin, upload.single('media'), updateAd)
    .delete(protect, admin, deleteAd);

module.exports = router;
