const db = require('../config/db');

// @desc Get all companies
const getCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const searchTerm = `%${search}%`;
        const result = await db.query(
            'SELECT id, name as company_name, contact_person, email, phone, website_url, type, status, created_at FROM ad_companies WHERE name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [searchTerm, limit, offset]
        );

        const countResult = await db.query('SELECT COUNT(*) FROM ad_companies WHERE name ILIKE $1', [searchTerm]);

        res.json({
            companies: result.rows,
            total: parseInt(countResult.rows[0].count),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Register a company
const registerCompany = async (req, res) => {
    try {
        const { company_name, contact_person, email, phone, website_url } = req.body;

        const result = await db.query(
            "INSERT INTO ad_companies (name, contact_person, email, phone, website_url, type, status) VALUES ($1, $2, $3, $4, $5, 'Corporate', 'active') RETURNING id, name as company_name, contact_person, email, phone, website_url, type, status, created_at",
            [company_name, contact_person, email, phone, website_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Update a company
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, contact_person, email, phone, website_url, status } = req.body;

        const result = await db.query(
            'UPDATE ad_companies SET name = $1, contact_person = $2, email = $3, phone = $4, website_url = $5, status = $6 WHERE id = $7 RETURNING id, name as company_name, contact_person, email, phone, website_url, type, status, created_at',
            [company_name, contact_person, email, phone, website_url, status, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Get company details
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT id, name as company_name, contact_person, email, phone, website_url, type, status, created_at FROM ad_companies WHERE id = $1', [id]);

        if (result.rows[0]) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Delete a company
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM ad_companies WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCompanies, registerCompany, updateCompany, getCompanyById, deleteCompany };
