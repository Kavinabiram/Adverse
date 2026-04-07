const db = require('../config/db');

const Driver = {
    findAll: async (limit, offset, searchTerm) => {
        const result = await db.query(
            'SELECT * FROM drivers WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [`%${searchTerm}%`, limit, offset]
        );
        return result.rows;
    },
    count: async (searchTerm) => {
        const result = await db.query('SELECT COUNT(*) FROM drivers WHERE name ILIKE $1 OR email ILIKE $1', [`%${searchTerm}%`]);
        return parseInt(result.rows[0].count);
    },
    findById: async (id) => {
        const result = await db.query('SELECT * FROM drivers WHERE id = $1', [id]);
        return result.rows[0];
    },
    create: async (name, phone, email, vehicle_number) => {
        const result = await db.query(
            'INSERT INTO drivers (name, phone, email, vehicle_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, phone, email, vehicle_number]
        );
        return result.rows[0];
    },
    update: async (id, name, phone, email, vehicle_number, status) => {
        const result = await db.query(
            'UPDATE drivers SET name = $1, phone = $2, email = $3, vehicle_number = $4, status = $5 WHERE id = $6 RETURNING *',
            [name, phone, email, vehicle_number, status, id]
        );
        return result.rows[0];
    }
};

module.exports = Driver;
