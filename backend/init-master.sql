-- Initialize Master Database for Retail Store
-- This creates the global product catalog and tenant registry

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema for global catalog
CREATE SCHEMA IF NOT EXISTS public;

-- This file will be automatically executed when the master database is created
-- The actual tables will be created by SQLAlchemy when the backend starts

-- Create a test superadmin user (for development only)
-- Password: admin123 (bcrypt hash)
-- You should change this in production
DO $$
BEGIN
    -- Tables will be created by SQLAlchemy
    RAISE NOTICE 'Master database initialized. Tables will be created by FastAPI backend.';
END $$;
