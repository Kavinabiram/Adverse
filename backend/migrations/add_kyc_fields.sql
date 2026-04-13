-- Migration: Add KYC details to Drivers table with flexible status logic
-- Date: 2026-04-13

DO $$ 
BEGIN 
    -- Aadhaar Number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='aadhaar_number') THEN
        ALTER TABLE drivers ADD COLUMN aadhaar_number VARCHAR(20);
    END IF;

    -- License Number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='license_number') THEN
        ALTER TABLE drivers ADD COLUMN license_number VARCHAR(50);
    END IF;

    -- File Paths
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='driver_photo') THEN
        ALTER TABLE drivers ADD COLUMN driver_photo TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='license_image') THEN
        ALTER TABLE drivers ADD COLUMN license_image TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='aadhaar_image') THEN
        ALTER TABLE drivers ADD COLUMN aadhaar_image TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='vehicle_rc_image') THEN
        ALTER TABLE drivers ADD COLUMN vehicle_rc_image TEXT;
    END IF;

    -- KYC Status (default to 'pending')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drivers' AND column_name='kyc_status') THEN
        ALTER TABLE drivers ADD COLUMN kyc_status VARCHAR(20) DEFAULT 'pending';
    ELSE
        -- Ensure default is 'pending' if it already existed with a different default
        ALTER TABLE drivers ALTER COLUMN kyc_status SET DEFAULT 'pending';
    END IF;

END $$;
