const db = require('./config/db');

async function addWebsiteUrlColumn() {
    try {
        console.log('Adding website_url column to ad_companies...');
        await db.query('ALTER TABLE ad_companies ADD COLUMN IF NOT EXISTS website_url VARCHAR(255)');
        console.log('Column added successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error adding column:', err);
        process.exit(1);
    }
}

addWebsiteUrlColumn();
