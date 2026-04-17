const db = require('./config/db');

async function migrateCompanies() {
    try {
        const result = await db.query('SELECT * FROM advertising_companies');
        for (let company of result.rows) {
            await db.query(
                `INSERT INTO ad_companies (name, contact_person, email, phone, type) VALUES ($1, $2, $3, $4, 'Corporate')`,
                [company.company_name, company.contact_person, company.email, company.phone]
            );
        }
        console.log('Migrated companies successfully');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        process.exit();
    }
}
migrateCompanies();
