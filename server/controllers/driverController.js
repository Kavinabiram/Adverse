const db = require('../config/db');

// @desc Get all drivers
// @route GET /api/drivers
// @access Private/Admin
const getDrivers = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const searchTerm = `%${search}%`;
    const result = await db.query(
        'SELECT * FROM drivers WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [searchTerm, limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM drivers WHERE name ILIKE $1 OR email ILIKE $1', [searchTerm]);

    res.json({
        drivers: result.rows,
        total: parseInt(countResult.rows[0].count),
    });
};

// @desc Register a driver
// @route POST /api/drivers
// @access Private/Admin
const registerDriver = async (req, res) => {
    const { name, phone, email, vehicle_number } = req.body;

    const result = await db.query(
        'INSERT INTO drivers (name, phone, email, vehicle_number) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, phone, email, vehicle_number]
    );

    res.status(201).json(result.rows[0]);
};

// @desc Update a driver
// @route PUT /api/drivers/:id
// @access Private/Admin
const updateDriver = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, vehicle_number, status } = req.body;

    const result = await db.query(
        'UPDATE drivers SET name = $1, phone = $2, email = $3, vehicle_number = $4, status = $5 WHERE id = $6 RETURNING *',
        [name, phone, email, vehicle_number, status, id]
    );

    res.json(result.rows[0]);
};

// @desc Get driver details
// @route GET /api/drivers/:id
// @access Private/Admin
const getDriverById = async (req, res) => {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM drivers WHERE id = $1', [id]);

    if (result.rows[0]) {
        res.json(result.rows[0]);
    } else {
        res.status(404);
        throw new Error('Driver not found');
    }
};

module.exports = { getDrivers, registerDriver, updateDriver, getDriverById };
