const db = require('./config/db');

async function checkCompaniesSchema() {
    try {
        const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'ad_companies'");
        console.log(res.rows.map(r => r.column_name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCompaniesSchema();
