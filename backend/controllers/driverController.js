const db = require('../config/db');

// @desc Get all drivers
// @route GET /api/drivers
// @access Private/Admin
const getDrivers = async (req, res) => {
    try {
        console.log('DEBUG: Fetching drivers with query:', req.query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Simplified query for troubleshooting
        const query = `
            SELECT 
                d.id, 
                u.name, 
                u.email, 
                u.phone, 
                d.auto_number as vehicle_number, 
                d.status,
                d.kyc_status,
                d.created_at
            FROM drivers d
            LEFT JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        
        const result = await db.query(query, [limit, offset]);
        console.log(`DEBUG: Found ${result.rows.length} drivers`);

        const countResult = await db.query('SELECT COUNT(*) FROM drivers');
        const total = parseInt(countResult.rows[0].count);

        res.json({
            drivers: result.rows,
            total: total,
        });
    } catch (error) {
        console.error('CRITICAL: Error in getDrivers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
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
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                d.*, 
                u.name, 
                u.email, 
                u.phone 
            FROM drivers d
            JOIN users u ON d.user_id = u.id
            WHERE d.id = $1
        `;
        const result = await db.query(query, [id]);

        if (result.rows[0]) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error in getDriverById:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDrivers, registerDriver, updateDriver, getDriverById };
