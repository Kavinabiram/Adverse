const adminService = require('../services/adminService');
const { 
    createDriverSchema, 
    enrollTabletSchema, 
    assignTabletSchema 
} = require('../utils/validators/adminValidator');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * Controller for Admin operations
 */
class AdminController {
    /**
     * @swagger
     * /admin/drivers:
     *   post:
     *     summary: Create a new driver
     *     tags: [Admin]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - phone
     *               - auto_number
     *             properties:
     *               name:
     *                 type: string
     *               phone:
     *                 type: string
     *               auto_number:
     *                 type: string
     *               email:
     *                 type: string
     *     responses:
     *       201:
     *         description: Driver created successfully
     *       400:
     *         description: Validation error
     */
    async createDriver(req, res, next) {
        try {
            const { error, value } = createDriverSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const driver = await adminService.createDriver(value);
            res.status(201).json(driver);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/drivers:
     *   get:
     *     summary: List all drivers with pagination
     *     tags: [Admin]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *     responses:
     *       200:
     *         description: List of drivers
     */
    async getDrivers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const data = await adminService.getDrivers(page, limit);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/tablets:
     *   post:
     *     summary: Enroll a new tablet
     *     tags: [Admin]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - tablet_uid
     *             properties:
     *               tablet_uid:
     *                 type: string
     *     responses:
     *       201:
     *         description: Tablet enrolled successfully
     */
    async enrollTablet(req, res, next) {
        try {
            const { error, value } = enrollTabletSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const tablet = await adminService.enrollTablet(value.tablet_uid);
            res.status(201).json(tablet);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/tablets/assign:
     *   post:
     *     summary: Assign a tablet to a driver
     *     tags: [Admin]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - tablet_id
     *               - driver_id
     *             properties:
     *               tablet_id:
     *                 type: string
     *               driver_id:
     *                 type: string
     *     responses:
     *       200:
     *         description: Tablet assigned successfully
     */
    async assignTablet(req, res, next) {
        try {
            const { error, value } = assignTabletSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const tablet = await adminService.assignTablet(value.tablet_id, value.driver_id);
            res.status(200).json(tablet);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/tablets/status:
     *   patch:
     *     summary: Update tablet status
     *     tags: [Admin]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - tablet_id
     *               - status
     *             properties:
     *               tablet_id:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [active, inactive]
     *     responses:
     *       200:
     *         description: Status updated successfully
     */
    async updateTabletStatus(req, res, next) {
        try {
            const { tablet_id, status } = req.body;
            if (!tablet_id || !status) {
                return res.status(400).json({ message: 'Tablet ID and status are required' });
            }

            const tablet = await adminService.updateTabletStatus(tablet_id, status);
            res.status(200).json(tablet);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/ads:
     *   post:
     *     summary: Create a new advertisement
     *     tags: [Admin]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               company_id:
     *                 type: string
     *               type:
     *                 type: string
     *                 enum: [Video, Poster]
     *               duration_seconds:
     *                 type: integer
     *               zone_ids:
     *                 type: array
     *                 items:
     *                   type: string
     *               media:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Ad created successfully
     */
    async createAd(req, res, next) {
        try {
            // Joi validation for metadata (parsing strings from form-data if needed)
            const adData = {
                ...req.body,
                zone_ids: req.body.zone_ids ? JSON.parse(req.body.zone_ids) : []
            };
            
            const { error, value } = createAdSchema.validate(adData);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            let fileUrl = '';
            if (req.file) {
                fileUrl = `/uploads/${req.file.filename}`;
            }

            const ad = await adminService.createAd(value, fileUrl);
            res.status(201).json(ad);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
