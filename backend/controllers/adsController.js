const db = require('../config/db');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const { uploadToB2 } = require('../services/backblaze.service');
const { generateThumbnail } = require('../services/video.service');

// @desc Get all ads
const getAds = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const searchTerm = `%${search}%`;
        const result = await db.query(
            'SELECT a.*, c.name as company_name FROM ads a LEFT JOIN ad_companies c ON a.ad_company_id = c.id WHERE a.title ILIKE $1 ORDER BY a.created_at DESC LIMIT $2 OFFSET $3',
            [searchTerm, limit, offset]
        );

        const countResult = await db.query('SELECT COUNT(*) FROM ads WHERE title ILIKE $1', [searchTerm]);

        res.json({
            ads: result.rows,
            total: parseInt(countResult.rows[0].count),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @swagger
 * /api/ads:
 *   post:
 *     summary: Create a new AD
 *     requestBody:
 *       required: true
 */
// @desc Create an ad
const createAd = async (req, res) => {
    console.log('Received create ad payload:', req.body);
    
    // Validation
    const schema = Joi.object({
        ad_company_id: Joi.string().uuid().required(),
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        contact_name: Joi.string().allow('', null),
        contact_phone: Joi.string().allow('', null),
        contact_email: Joi.string().email().allow('', null),
        website_url: Joi.string().uri().allow('', null),
        location_name: Joi.string().allow('', null),
        location_lat: Joi.number().allow(null),
        location_lng: Joi.number().allow(null),
        google_maps_url: Joi.string().uri().allow('', null),
        type: Joi.string().valid('Video', 'Poster').required(),
        file_url: Joi.string().uri().required(),
        thumbnail_url: Joi.string().uri().allow('', null),
        duration_seconds: Joi.number().integer().min(0).allow(null),
        video_size: Joi.number().integer().min(0).allow(null),
        video_format: Joi.string().max(20).allow('', null),
        status: Joi.string().valid('active', 'inactive').default('active')
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        console.error('Validation error details:', error.details[0].message, 'payload was:', req.body);
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const result = await db.query(
            `INSERT INTO ads (
                ad_company_id, title, description, contact_name, contact_phone, 
                contact_email, website_url, location_name, location_lat, location_lng, 
                google_maps_url, type, file_url, thumbnail_url, duration_seconds, 
                video_size, video_format, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
            [
                value.ad_company_id, value.title, value.description, value.contact_name, value.contact_phone,
                value.contact_email, value.website_url, value.location_name, value.location_lat, value.location_lng,
                value.google_maps_url, value.type, value.file_url, value.thumbnail_url, value.duration_seconds,
                value.video_size, value.video_format, value.status
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('DB Insert error:', err);
        res.status(500).json({ message: 'Error creating ad', error: err.message });
    }
};

/**
 * @swagger
 * /api/ads/upload-video:
 *   post:
 *     summary: Upload video and generate thumbnail
 */
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file provided' });
        }

        const videoPath = req.file.path;
        const videoFormat = path.extname(req.file.originalname).substring(1);
        const videoSize = req.file.size;
        const filename = req.file.filename;

        // Generate thumbnail
        const thumbnailName = `thumb-${Date.now()}.jpg`;
        const thumbnailPath = await generateThumbnail(videoPath, 'uploads', thumbnailName);

        // Upload to B2
        const videoUpload = await uploadToB2(videoPath, 'ads/videos', filename);
        const thumbnailUpload = await uploadToB2(thumbnailPath, 'ads/thumbnails', thumbnailName);

        // Cleanup
        fs.unlinkSync(videoPath);
        fs.unlinkSync(thumbnailPath);

        res.json({
            file_url: videoUpload.url,
            thumbnail_url: thumbnailUpload.url,
            duration_seconds: 0, // Placeholder, can be extracted using FFmpeg, though not required here
            video_size: videoSize,
            video_format: videoFormat
        });
    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error uploading video', error: error.message });
    }
};

/**
 * @swagger
 * /api/ads/update-thumbnail:
 *   post:
 *     summary: Update an AD's thumbnail
 */
const updateThumbnail = async (req, res) => {
    try {
        const { id } = req.body;
        if (!req.file || !id) {
            return res.status(400).json({ message: 'Ad ID and thumbnail file are required' });
        }

        const thumbnailPath = req.file.path;
        const thumbnailName = req.file.filename;

        const thumbnailUpload = await uploadToB2(thumbnailPath, 'ads/thumbnails', thumbnailName);
        
        fs.unlinkSync(thumbnailPath);

        const result = await db.query(
            'UPDATE ads SET thumbnail_url = $1 WHERE id = $2 RETURNING *',
            [thumbnailUpload.url, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.json({ message: 'Thumbnail updated successfully', ad: result.rows[0] });

    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error updating thumbnail', error: error.message });
    }
};

/**
 * @swagger
 * /api/ads/upload-thumbnail:
 *   post:
 *     summary: Upload custom thumbnail during creation
 */
const uploadCustomThumbnail = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No thumbnail file provided' });
        }

        const thumbnailPath = req.file.path;
        const thumbnailName = req.file.filename;

        const thumbnailUpload = await uploadToB2(thumbnailPath, 'ads/thumbnails', thumbnailName);

        fs.unlinkSync(thumbnailPath);

        res.json({ thumbnail_url: thumbnailUpload.url });
    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error uploading thumbnail', error: error.message });
    }
};

// @desc Update an ad
const updateAd = async (req, res) => {
    const { id } = req.params;
    
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        status: Joi.string().valid('active', 'inactive').required(),
        location_name: Joi.string().allow('', null),
        location_lat: Joi.number().allow(null),
        location_lng: Joi.number().allow(null),
        google_maps_url: Joi.string().uri().allow('', null),
        age_target: Joi.string().allow('', null),
        duration_seconds: Joi.number().integer().min(0).allow(null)
    }).unknown(true); // Allow other fields to pass through if sent

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const result = await db.query(
            `UPDATE ads SET 
                title = $1, description = $2, status = $3, 
                location_name = $4, location_lat = $5, location_lng = $6, 
                google_maps_url = $7, age_target = $8, duration_seconds = $9 
            WHERE id = $10 RETURNING *`,
            [
                value.title, value.description, value.status, 
                value.location_name, value.location_lat, value.location_lng, 
                value.google_maps_url, value.age_target, value.duration_seconds, 
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating ad', error: err.message });
    }
};

// @desc Delete an ad
const deleteAd = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM ads WHERE id = $1', [id]);
        res.json({ message: 'Ad removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting ad' });
    }
};

// @desc Get ad by ID
const getAdById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'SELECT a.*, c.name as company_name FROM ads a LEFT JOIN ad_companies c ON a.ad_company_id = c.id WHERE a.id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    getAds, 
    getAdById, 
    createAd, 
    updateAd, 
    deleteAd, 
    uploadVideo, 
    updateThumbnail, 
    uploadCustomThumbnail 
};
