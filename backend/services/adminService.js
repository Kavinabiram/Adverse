const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Service for Admin related business logic
 */
class AdminService {
    /**
     * Creates a new driver by creating a User entry and then a Driver entry
     * @param {Object} driverData 
     * @returns {Promise<Object>} The created driver object
     */
    async createDriver(driverData) {
        // We would ideally use a transaction here
        // Since the current db.js only exposes db.query, we'll implement a simple transaction logic
        // In a real project, we'd use a transaction helper
        
        const { name, phone, auto_number, email } = driverData;
        const driverCode = `DV-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Use phone as temporary auth_uid for now
        const authUid = phone;

        // Note: For actual transactions with pg-pool, we should get a client
        // but for this task I will perform them sequentially or use a TRANSACTION block if possible.
        // Let's use a simple sequential approach for now, or suggest updating db.js later.
        
        try {
            // 1. Create User
            const userRes = await db.query(
                'INSERT INTO users (auth_uid, role, name, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [authUid, 'Driver', name, phone, email || null]
            );
            const userId = userRes.rows[0].id;

            // 2. Create Driver
            const driverRes = await db.query(
                'INSERT INTO drivers (user_id, auto_number, driver_code) VALUES ($1, $2, $3) RETURNING *',
                [userId, auto_number, driverCode]
            );
            
            return {
                ...driverRes.rows[0],
                name,
                phone
            };
        } catch (error) {
            console.error('Error creating driver:', error);
            throw error;
        }
    }

    /**
     * Gets a list of drivers with pagination
     * @param {number} page 
     * @param {number} limit 
     */
    async getDrivers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        const countRes = await db.query('SELECT COUNT(*) FROM drivers');
        const total = parseInt(countRes.rows[0].count);
        
        const driversRes = await db.query(
            `SELECT d.*, u.name, u.phone, u.email 
             FROM drivers d 
             JOIN users u ON d.user_id = u.id 
             ORDER BY d.created_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        
        return {
            drivers: driversRes.rows,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Enrolls a new tablet into the system
     * @param {string} tabletUid 
     */
    async enrollTablet(tabletUid) {
        const result = await db.query(
            'INSERT INTO tablets (tablet_uid) VALUES ($1) RETURNING *',
            [tabletUid]
        );
        return result.rows[0];
    }

    /**
     * Assigns a tablet to a driver
     * @param {string} tabletId 
     * @param {string} driverId 
     */
    async assignTablet(tabletId, driverId) {
        const result = await db.query(
            'UPDATE tablets SET assigned_driver_id = $1 WHERE id = $2 RETURNING *',
            [driverId, tabletId]
        );
        
        if (result.rowCount === 0) {
            throw new Error('Tablet not found');
        }
        
        return result.rows[0];
    }

    /**
     * Updates tablet status
     * @param {string} tabletId 
     * @param {string} status 
     */
    async updateTabletStatus(tabletId, status) {
        const result = await db.query(
            'UPDATE tablets SET status = $1 WHERE id = $2 RETURNING *',
            [status, tabletId]
        );
        
        if (result.rowCount === 0) {
            throw new Error('Tablet not found');
        }
        
        return result.rows[0];
    }

    /**
     * Creates a new advertisement and assigns it to zones
     * @param {Object} adData 
     * @param {string} fileUrl 
     */
    async createAd(adData, fileUrl) {
        const { company_id, title, description, type, duration_seconds, zone_ids } = adData;
        
        // 1. Create Ad
        const adRes = await db.query(
            'INSERT INTO ads (ad_company_id, title, description, type, duration_seconds, file_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [company_id, title, description, type, duration_seconds, fileUrl]
        );
        const adId = adRes.rows[0].id;

        // 2. Assign to Zones if provided
        if (zone_ids && zone_ids.length > 0) {
            for (const zoneId of zone_ids) {
                await db.query(
                    'INSERT INTO ad_assignments (ad_id, zone_id) VALUES ($1, $2)',
                    [adId, zoneId]
                );
            }
        }

        return adRes.rows[0];
    }
}

module.exports = new AdminService();
