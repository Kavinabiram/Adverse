const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const migrate = async () => {
    try {
        console.log('Starting Database Migration...');
        const sqlPath = path.join(__dirname, 'setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the entire SQL script
        await db.query(sql);

        console.log('✅ Database tables created successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
