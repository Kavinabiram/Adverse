-- Database: vehicle_advertising

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Admin', -- 'Admin', 'Staff'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    vehicle_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Disabled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advertising_companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Disabled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advertisements (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES advertising_companies(id) ON DELETE CASCADE,
    ad_title VARCHAR(255) NOT NULL,
    ad_type VARCHAR(50), -- 'Video', 'Poster'
    media_url TEXT,
    duration INTEGER, -- in seconds
    location_target VARCHAR(255),
    age_target VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Paused', 'Expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advertising_areas (
    id SERIAL PRIMARY KEY,
    area_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS revenue (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    ad_id INTEGER REFERENCES advertisements(id),
    amount DECIMAL(10, 2),
    commission DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES advertising_companies(id),
    amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Unpaid', -- 'Paid', 'Unpaid', 'Pending'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin
-- Password is 'admin123'
