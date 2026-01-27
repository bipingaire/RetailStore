-- Create the master database if it doesn't exist
SELECT 'CREATE DATABASE retailstore_master'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'retailstore_master')\gexec

-- Connect to the database
\c retailstore_master

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema
CREATE SCHEMA IF NOT EXISTS public;
