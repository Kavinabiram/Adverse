const db = require('./config/db');

async function checkAds() {
    try {
        const result = await db.query('SELECT title, thumbnail_url, file_url FROM ads');
        console.log(JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAds();
