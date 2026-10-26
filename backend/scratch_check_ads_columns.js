const db = require('./config/db');

async function checkAdsSchema() {
    try {
        const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'ads'");
        console.log(res.rows.map(r => r.column_name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdsSchema();
