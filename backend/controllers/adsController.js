const db = require('../config/db');

// @desc Get all ads
const getAds = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const searchTerm = `%${search}%`;
    const result = await db.query(
        'SELECT a.*, c.company_name FROM advertisements a LEFT JOIN advertising_companies c ON a.company_id = c.id WHERE a.ad_title ILIKE $1 ORDER BY a.created_at DESC LIMIT $2 OFFSET $3',
        [searchTerm, limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM advertisements WHERE ad_title ILIKE $1', [searchTerm]);

    res.json({
        ads: result.rows,
        total: parseInt(countResult.rows[0].count),
    });
};

// @desc Create an ad
const createAd = async (req, res) => {
    const { company_id, ad_title, ad_type, duration, location_target, age_target } = req.body;
    let media_url = '';

    if (req.file) {
        media_url = `/uploads/${req.file.filename}`;
    }

    const result = await db.query(
        'INSERT INTO advertisements (company_id, ad_title, ad_type, duration, location_target, age_target, media_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [company_id, ad_title, ad_type, duration, location_target, age_target, media_url]
    );

    res.status(201).json(result.rows[0]);
};

// @desc Update an ad
const updateAd = async (req, res) => {
    const { id } = req.params;
    const { ad_title, ad_type, duration, location_target, age_target, status } = req.body;

    let updateQuery = 'UPDATE advertisements SET ad_title = $1, ad_type = $2, duration = $3, location_target = $4, age_target = $5, status = $6';
    let params = [ad_title, ad_type, duration, location_target, age_target, status];

    if (req.file) {
        updateQuery += ', media_url = $7 WHERE id = $8 RETURNING *';
        params.push(`/uploads/${req.file.filename}`, id);
    } else {
        updateQuery += ' WHERE id = $7 RETURNING *';
        params.push(id);
    }

    const result = await db.query(updateQuery, params);
    res.json(result.rows[0]);
};

// @desc Delete an ad
const deleteAd = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM advertisements WHERE id = $1', [id]);
    res.json({ message: 'Ad removed' });
};

module.exports = { getAds, createAd, updateAd, deleteAd };
