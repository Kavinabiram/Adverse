const db = require('../config/db');

const Ad = {
    findAll: async (limit, offset, searchTerm) => {
        const result = await db.query(
            'SELECT a.*, c.company_name FROM advertisements a LEFT JOIN advertising_companies c ON a.company_id = c.id WHERE a.ad_title ILIKE $1 ORDER BY a.created_at DESC LIMIT $2 OFFSET $3',
            [`%${searchTerm}%`, limit, offset]
        );
        return result.rows;
    },
    count: async (searchTerm) => {
        const result = await db.query('SELECT COUNT(*) FROM advertisements WHERE ad_title ILIKE $1', [`%${searchTerm}%`]);
        return parseInt(result.rows[0].count);
    },
    findById: async (id) => {
        const result = await db.query('SELECT a.*, c.company_name FROM advertisements a LEFT JOIN advertising_companies c ON a.company_id = c.id WHERE a.id = $1', [id]);
        return result.rows[0];
    },
    create: async (company_id, ad_title, ad_type, duration, location_target, age_target, media_url) => {
        const result = await db.query(
            'INSERT INTO advertisements (company_id, ad_title, ad_type, duration, location_target, age_target, media_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [company_id, ad_title, ad_type, duration, location_target, age_target, media_url]
        );
        return result.rows[0];
    },
    update: async (id, ad_title, ad_type, duration, location_target, age_target, status, media_url) => {
        let updateQuery = 'UPDATE advertisements SET ad_title = $1, ad_type = $2, duration = $3, location_target = $4, age_target = $5, status = $6';
        let params = [ad_title, ad_type, duration, location_target, age_target, status];
        
        if (media_url) {
            updateQuery += ', media_url = $7 WHERE id = $8 RETURNING *';
            params.push(media_url, id);
        } else {
            updateQuery += ' WHERE id = $7 RETURNING *';
            params.push(id);
        }
        
        const result = await db.query(updateQuery, params);
        return result.rows[0];
    },
    delete: async (id) => {
        await db.query('DELETE FROM advertisements WHERE id = $1', [id]);
        return true;
    }
};

module.exports = Ad;
