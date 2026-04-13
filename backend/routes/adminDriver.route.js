const express = require('express');
const router = express.Router();
const { createDriverWithKYC, updateDriverWithKYC } = require('../controllers/adminDriver.controller');
const { driverKYCUpload } = require('../middleware/upload.middleware');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /admin/drivers/create:
 *   post:
 *     summary: Register a new driver with full KYC details (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - vehicle_number
 *               - aadhaar_number
 *               - license_number
 *               - license_image
 *               - aadhaar_image
 *               - driver_photo
 *               - vehicle_rc_image
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               vehicle_number: { type: string }
 *               aadhaar_number: { type: string }
 *               license_number: { type: string }
 *               license_image: { type: string, format: binary }
 *               aadhaar_image: { type: string, format: binary }
 *               driver_photo: { type: string, format: binary }
 *               vehicle_rc_image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       400:
 *         description: Validation error or missing files
 */
router.post('/create', protect, admin, driverKYCUpload, createDriverWithKYC);

/**
 * @swagger
 * /admin/drivers/{id}:
 *   put:
 *     summary: Update driver profile and KYC documents
 *     tags: [Admin Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Successfully updated }
 */
router.put('/:id', protect, admin, driverKYCUpload, updateDriverWithKYC);

module.exports = router;
