-- Database: vehicle_advertising
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS tamper_events CASCADE;
DROP TABLE IF EXISTS ad_interactions CASCADE;
DROP TABLE IF EXISTS ad_play_logs CASCADE;
DROP TABLE IF EXISTS ad_assignments CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS ad_company_zones CASCADE;
DROP TABLE IF EXISTS ad_companies CASCADE;
DROP TABLE IF EXISTS driver_zones CASCADE;
DROP TABLE IF EXISTS zone_geofences CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS tablets CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_uid VARCHAR UNIQUE NOT NULL, -- From Firebase/Auth Provider
    role VARCHAR NOT NULL DEFAULT 'Admin', -- 'Admin', 'Driver', 'Staff'
    name VARCHAR,
    phone VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Drivers Table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    auto_number VARCHAR,
    driver_code VARCHAR UNIQUE,
    franchise_id UUID,
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tablets Table
CREATE TABLE tablets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tablet_uid VARCHAR UNIQUE NOT NULL,
    assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    status VARCHAR DEFAULT 'active',
    last_seen_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Zones Table
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    city VARCHAR,
    state VARCHAR,
    zone_code VARCHAR UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Geo Fences Table
CREATE TABLE zone_geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    name VARCHAR,
    polygon JSON,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Driver Zones Mapping
CREATE TABLE driver_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE
);

-- Ad Companies Table
CREATE TABLE ad_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR, -- 'Corporate', 'Local'
    name VARCHAR NOT NULL,
    contact_person VARCHAR,
    phone VARCHAR,
    email VARCHAR UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ad Company Zones Mapping
CREATE TABLE ad_company_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_company_id UUID REFERENCES ad_companies(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE
);

-- Advertisements Table
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_company_id UUID REFERENCES ad_companies(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    contact_name VARCHAR,
    contact_phone VARCHAR,
    contact_email VARCHAR,
    website_url VARCHAR,
    location_name VARCHAR,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    google_maps_url VARCHAR,
    type VARCHAR, -- 'Video', 'Poster'
    file_url TEXT,
    duration_seconds INT,
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ad Assignments (Zones)
CREATE TABLE ad_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE
);

-- Ad Play Logs
CREATE TABLE ad_play_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    tablet_id UUID REFERENCES tablets(id) ON DELETE CASCADE,
    played_at TIMESTAMP DEFAULT NOW(),
    duration_played INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Ad Interactions
CREATE TABLE ad_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    tablet_id UUID REFERENCES tablets(id) ON DELETE CASCADE,
    type VARCHAR, -- 'like', 'dislike', 'click'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tamper Events
CREATE TABLE tamper_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tablet_id UUID REFERENCES tablets(id) ON DELETE CASCADE,
    type VARCHAR, -- 'charger_removed', 'gps_lost'
    reported_at TIMESTAMP DEFAULT NOW()
);

-- Legacy Tables (Optional, but included for backward compatibility if needed)
CREATE TABLE revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id),
    ad_id UUID REFERENCES ads(id),
    amount DECIMAL(10, 2),
    commission DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES ad_companies(id),
    amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Initial Admin User if needed
-- auth_uid would normally come from Firebase/Supabase
-- INSERT INTO users (auth_uid, role, name, email) VALUES ('admin_legacy', 'Admin', 'Super Admin', 'admin@adverse.com');
