const db = require('./config/db.js');

async function run() {
  try {
    await db.query(`
      ALTER TABLE ads 
      ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
      ADD COLUMN IF NOT EXISTS video_size BIGINT,
      ADD COLUMN IF NOT EXISTS video_format VARCHAR(20);
    `);
    console.log('Columns added successfully');
  } catch (err) {
    console.error('Error adding columns:', err);
  } finally {
    process.exit();
  }
}
run();
