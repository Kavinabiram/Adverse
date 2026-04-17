const db = require('./config/db');

async function check() {
    try {
        const res = await db.query('SELECT COUNT(*) FROM ad_play_logs');
        console.log('LOGS COUNT:', res.rows[0].count);
        const res2 = await db.query('SELECT * FROM ad_play_logs LIMIT 5');
        console.log('SAMPLE:', res2.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
