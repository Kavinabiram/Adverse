const db = require('./config/db');

async function cleanupUrls() {
    try {
        console.log('Fetching ads...');
        const result = await db.query('SELECT id, file_url, thumbnail_url FROM ads');
        
        for (const ad of result.rows) {
            const cleanFileUrl = ad.file_url ? ad.file_url.split('?')[0] : null;
            const cleanThumbnailUrl = ad.thumbnail_url ? ad.thumbnail_url.split('?')[0] : null;
            
            if (cleanFileUrl !== ad.file_url || cleanThumbnailUrl !== ad.thumbnail_url) {
                console.log(`Cleaning ad ${ad.id}...`);
                await db.query(
                    'UPDATE ads SET file_url = $1, thumbnail_url = $2 WHERE id = $3',
                    [cleanFileUrl, cleanThumbnailUrl, ad.id]
                );
            }
        }
        
        console.log('Cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupUrls();
