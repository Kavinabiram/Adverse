const express = require('express');
const router = express.Router();
const { getCompanies, registerCompany, updateCompany, getCompanyById, deleteCompany } = require('../controllers/companyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getCompanies)
    .post(protect, admin, registerCompany);

router.route('/:id')
    .get(protect, admin, getCompanyById)
    .put(protect, admin, updateCompany)
    .delete(protect, admin, deleteCompany);

module.exports = router;
