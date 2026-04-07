const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },
    create: async (name, email, password, role = 'Admin') => {
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, password, role]
        );
        return result.rows[0];
    }
};

module.exports = User;
