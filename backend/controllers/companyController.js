const db = require('../config/db');

// @desc Get all companies
const getCompanies = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const searchTerm = `%${search}%`;
    const result = await db.query(
        'SELECT * FROM advertising_companies WHERE company_name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [searchTerm, limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM advertising_companies WHERE company_name ILIKE $1', [searchTerm]);

    res.json({
        companies: result.rows,
        total: parseInt(countResult.rows[0].count),
    });
};

// @desc Register a company
const registerCompany = async (req, res) => {
    const { company_name, contact_person, email, phone } = req.body;

    const result = await db.query(
        'INSERT INTO advertising_companies (company_name, contact_person, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
        [company_name, contact_person, email, phone]
    );

    res.status(201).json(result.rows[0]);
};

// @desc Update a company
const updateCompany = async (req, res) => {
    const { id } = req.params;
    const { company_name, contact_person, email, phone, status } = req.body;

    const result = await db.query(
        'UPDATE advertising_companies SET company_name = $1, contact_person = $2, email = $3, phone = $4, status = $5 WHERE id = $6 RETURNING *',
        [company_name, contact_person, email, phone, status, id]
    );

    res.json(result.rows[0]);
};

// @desc Get company details
const getCompanyById = async (req, res) => {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM advertising_companies WHERE id = $1', [id]);

    if (result.rows[0]) {
        res.json(result.rows[0]);
    } else {
        res.status(404);
        throw new Error('Company not found');
    }
};

module.exports = { getCompanies, registerCompany, updateCompany, getCompanyById };
