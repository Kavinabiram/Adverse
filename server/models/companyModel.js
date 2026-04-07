const db = require('../config/db');

const Company = {
    findAll: async (limit, offset, searchTerm) => {
        const result = await db.query(
            'SELECT * FROM advertising_companies WHERE company_name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [`%${searchTerm}%`, limit, offset]
        );
        return result.rows;
    },
    count: async (searchTerm) => {
        const result = await db.query('SELECT COUNT(*) FROM advertising_companies WHERE company_name ILIKE $1', [`%${searchTerm}%`]);
        return parseInt(result.rows[0].count);
    },
    findById: async (id) => {
        const result = await db.query('SELECT * FROM advertising_companies WHERE id = $1', [id]);
        return result.rows[0];
    },
    create: async (company_name, contact_person, email, phone) => {
        const result = await db.query(
            'INSERT INTO advertising_companies (company_name, contact_person, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
            [company_name, contact_person, email, phone]
        );
        return result.rows[0];
    },
    update: async (id, company_name, contact_person, email, phone, status) => {
        const result = await db.query(
            'UPDATE advertising_companies SET company_name = $1, contact_person = $2, email = $3, phone = $4, status = $5 WHERE id = $6 RETURNING *',
            [company_name, contact_person, email, phone, status, id]
        );
        return result.rows[0];
    }
};

module.exports = Company;
