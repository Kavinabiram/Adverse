const db = require('./config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        // Clear existing data (Optional, handle with care)
        // await db.query('TRUNCATE users, drivers, advertising_companies, advertisements, revenue, invoices RESTART IDENTITY CASCADE');

        // Create Super Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role',
            ['Admin', 'admin@adverse.com', hashedPassword, 'Admin']
        );

        // Create Dummy Drivers
        await db.query(`
            INSERT INTO drivers (name, phone, email, vehicle_number, status) VALUES 
            ('Rahul Sharma', '9876543210', 'rahul@example.com', 'MH-01-AB-1234', 'Active'),
            ('Suresh Kumar', '9876543211', 'suresh@example.com', 'KA-05-CD-5678', 'Active')
            ON CONFLICT (email) DO NOTHING
        `);

        // Create Dummy Companies
        await db.query(`
            INSERT INTO advertising_companies (company_name, contact_person, email, phone, status) VALUES 
            ('Coca Cola India', 'Amit Shah', 'ads@cocacola.in', '022-1234567', 'Active'),
            ('Samsung Mobile', 'Lee Kun', 'marketing@samsung.com', '011-7654321', 'Active')
            ON CONFLICT (email) DO NOTHING
        `);

        // Create Dummy Ads
        await db.query(`
            INSERT INTO advertisements (company_id, ad_title, ad_type, duration, location_target, age_target, status) VALUES 
            (1, 'Refreshing Summer', 'Video', 15, 'Mumbai, Delhi', '15-40', 'Active'),
            (2, 'Galaxy S26 Launch', 'Poster', 10, 'Bangalore', '18-45', 'Active')
        `);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
