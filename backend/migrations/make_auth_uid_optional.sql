-- Migration: Make auth_uid column optional in users table
-- Date: 2026-04-13

DO $$ 
BEGIN 
    -- Remove NOT NULL constraint from auth_uid
    ALTER TABLE users ALTER COLUMN auth_uid DROP NOT NULL;

    -- Note: We keep the UNIQUE constraint (if it exists) because each driver 
    -- will eventually have a unique Firebase ID linked to their account.
END $$;
