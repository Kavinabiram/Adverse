const express = require('express');
const router = express.Router();
const setupAdminController = require('../controllers/setupAdmin.controller');

/**
 * @route POST /setup-admin
 * @desc Create the first admin account
 * @access Public (Temporary)
 */
router.post('/', setupAdminController.createFirstAdmin);

module.exports = router;
