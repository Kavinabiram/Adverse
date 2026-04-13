const setupAdminService = require('../services/setupAdmin.service');
const Joi = require('joi');

/**
 * @swagger
 * tags:
 *   name: Setup
 *   description: Initial system setup
 */

/**
 * Validation schema for admin setup
 */
const setupAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/**
 * Controller for initial admin setup
 */
class SetupAdminController {
  /**
   * @swagger
   * /setup-admin:
   *   post:
   *     summary: Create the first admin account
   *     tags: [Setup]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: Admin account created successfully
   *       400:
   *         description: Validation error or admin already exists
   *       500:
   *         description: Internal server error
   */
  async createFirstAdmin(req, res, next) {
    try {
      // 1. Validate request
      const { error, value } = setupAdminSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
      }

      // 2. Ensure schema is ready (adds password_hash column if missing)
      await setupAdminService.ensureSchema();

      // 3. Check if any admin already exists
      const exists = await setupAdminService.adminExists();
      if (exists) {
        return res.status(400).json({ 
          status: 'error', 
          message: "Admin account already exists. Setup disabled." 
        });
      }

      // 4. Create admin
      const admin = await setupAdminService.createAdmin(value);

      res.status(201).json({
        status: 'success',
        message: 'Admin account created successfully.',
        data: admin
      });
    } catch (err) {
      console.error('Setup Admin Error:', err);
      res.status(500).json({ 
        status: 'error', 
        message: 'An error occurred during admin setup.',
        details: err.message
      });
    }
  }
}

module.exports = new SetupAdminController();
