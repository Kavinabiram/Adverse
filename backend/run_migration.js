const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function migrate() {
    try {
        console.log('--- Starting Migration ---');
        
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'migrations', 'add_kyc_fields.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the query
        await db.query(sql);

        console.log('✅ Migration Successful: KYC columns added to drivers table.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed!');
        console.error(error.message);
        process.exit(1);
    }
}

migrate();
