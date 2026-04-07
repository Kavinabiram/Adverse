const db = require('./config/db');

const updateAdmin = async () => {
    try {
        await db.query(
            "UPDATE users SET name = 'Admin', role = 'Admin' WHERE email = 'admin@adverse.com'"
        );
        console.log('Admin user updated successfully in the database.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating admin user:', error);
        process.exit(1);
    }
};

updateAdmin();
