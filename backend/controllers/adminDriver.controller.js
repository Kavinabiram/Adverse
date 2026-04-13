const db = require('../config/db');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

/**
 * Driver KYC Validation Schema
 * All fields are currently optional for admin-based registration
 */
const createDriverKYCSchema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().required().pattern(/^[0-9+-\s]{10,15}$/),
    vehicle_number: Joi.string().required(),
    aadhaar_number: Joi.string().length(12).pattern(/^[0-9]+$/).optional().allow('', null),
    license_number: Joi.string().optional().allow('', null)
});

/**
 * @desc Create driver with flexible KYC Details
 * @route POST /api/admin/drivers/create
 */
const createDriverWithKYC = async (req, res, next) => {
    try {
        // 1. Validate Text Fields
        const { error, value } = createDriverKYCSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // 2. KYC Status Logic (Flexible for Admin-based Onboarding)
        /**
         * FUTURE-READY LOGIC:
         * Currently, we follow a "Lazy KYC" rule: if at least one document is uploaded, 
         * we mark it as completed because admins are trusted to upload valid docs.
         * 
         * TO UPGRADE TO STRICT KYC (e.g., for self-registration):
         * 1. Change 'some' to 'every' below.
         * 2. Ensure text fields like 'aadhaar_number' and 'license_number' are also checked.
         * 3. Set migration default for 'kyc_status' to 'pending' (already done).
         */
        const files = req.files || {};
        const documentFields = ['license_image', 'aadhaar_image', 'driver_photo', 'vehicle_rc_image'];
        
        const hasAnyDocument = documentFields.some(field => files[field] && files[field].length > 0);
        const kyc_status = hasAnyDocument ? 'completed' : 'pending';

        // 3. Database Transaction
        const { name, email, phone, vehicle_number, aadhaar_number, license_number } = value;
        
        // Prepare file paths (only for those uploaded)
        const docPaths = {
            license_image: files['license_image'] ? `/uploads/drivers/kyc/${files['license_image'][0].filename}` : null,
            aadhaar_image: files['aadhaar_image'] ? `/uploads/drivers/kyc/${files['aadhaar_image'][0].filename}` : null,
            driver_photo: files['driver_photo'] ? `/uploads/drivers/kyc/${files['driver_photo'][0].filename}` : null,
            vehicle_rc_image: files['vehicle_rc_image'] ? `/uploads/drivers/kyc/${files['vehicle_rc_image'][0].filename}` : null
        };

        const client = await db.pool.connect();
        
        try {
            await client.query('BEGIN');

            const userExists = await client.query('SELECT id FROM users WHERE email = $1 OR phone = $2', [email, phone]);
            if (userExists.rows.length > 0) {
                await client.release();
                return res.status(400).json({ message: 'Driver with this email or phone already exists' });
            }

            /**
             * Create User Record
             */
            const userResult = await client.query(
                `INSERT INTO users (name, email, phone, role, status, auth_uid) 
                 VALUES ($1, $2, $3, 'Driver', 'active', NULL) 
                 RETURNING id`,
                [name, email, phone]
            );
            const userId = userResult.rows[0].id;

            // Create Driver with Flexible KYC
            const driverResult = await client.query(
                `INSERT INTO drivers (
                    user_id, 
                    auto_number, 
                    aadhaar_number, 
                    license_number, 
                    license_image, 
                    aadhaar_image, 
                    driver_photo, 
                    vehicle_rc_image, 
                    kyc_status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING *`,
                [
                    userId, 
                    vehicle_number, 
                    aadhaar_number || null, 
                    license_number || null, 
                    docPaths.license_image, 
                    docPaths.aadhaar_image, 
                    docPaths.driver_photo, 
                    docPaths.vehicle_rc_image,
                    kyc_status
                ]
            );

            await client.query('COMMIT');
            
            res.status(201).json({
                message: `Driver registered successfully (KYC: ${kyc_status})`,
                driver: driverResult.rows[0]
            });

        } catch (dbError) {
            await client.query('ROLLBACK');
            throw dbError;
        } finally {
            client.release();
        }

    } catch (err) {
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        next(err);
    }
};

/**
 * @desc Update driver with KYC Details
 * @route PUT /api/admin/drivers/:id
 */
const updateDriverWithKYC = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone, vehicle_number, aadhaar_number, license_number, status } = req.body;
        const files = req.files || {};

        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            const existing = await client.query('SELECT * FROM drivers WHERE id = $1', [id]);
            if (existing.rows.length === 0) {
                await client.release();
                return res.status(404).json({ message: 'Driver not found' });
            }
            const driver = existing.rows[0];

            await client.query(
                `UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4`,
                [name, email, phone, driver.user_id]
            );

            const docPaths = {
                license_image: files['license_image'] ? `/uploads/drivers/kyc/${files['license_image'][0].filename}` : driver.license_image,
                aadhaar_image: files['aadhaar_image'] ? `/uploads/drivers/kyc/${files['aadhaar_image'][0].filename}` : driver.aadhaar_image,
                driver_photo: files['driver_photo'] ? `/uploads/drivers/kyc/${files['driver_photo'][0].filename}` : driver.driver_photo,
                vehicle_rc_image: files['vehicle_rc_image'] ? `/uploads/drivers/kyc/${files['vehicle_rc_image'][0].filename}` : driver.vehicle_rc_image
            };

            const documentFields = ['license_image', 'aadhaar_image', 'driver_photo', 'vehicle_rc_image'];
            const hasAnyDocument = documentFields.some(field => docPaths[field]);
            const kyc_status = hasAnyDocument ? 'completed' : 'pending';

            const updateQuery = `
                UPDATE drivers SET 
                    auto_number = $1, 
                    aadhaar_number = $2, 
                    license_number = $3, 
                    license_image = $4, 
                    aadhaar_image = $5, 
                    driver_photo = $6, 
                    vehicle_rc_image = $7, 
                    kyc_status = $8,
                    status = $9
                WHERE id = $10
                RETURNING *
            `;
            
            const result = await client.query(updateQuery, [
                vehicle_number,
                aadhaar_number || driver.aadhaar_number,
                license_number || driver.license_number,
                docPaths.license_image,
                docPaths.aadhaar_image,
                docPaths.driver_photo,
                docPaths.vehicle_rc_image,
                kyc_status,
                status || driver.status,
                id
            ]);

            await client.query('COMMIT');
            res.json({ message: 'Driver updated successfully', driver: result.rows[0] });

        } catch (dbError) {
            await client.query('ROLLBACK');
            throw dbError;
        } finally {
            client.release();
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createDriverWithKYC,
    updateDriverWithKYC
};
