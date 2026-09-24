-- PostgreSQL Production Database Migration Script
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('diner', 'merchant', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING_AI', 'AI_VERIFIED', 'PENDING_HUMAN_REVIEW', 'REJECTED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE venue_type AS ENUM ('RESTAURANT', 'CAFE', 'BAKERY', 'FOOD_TRUCK', 'BUTCHER_SHOP', 'GHOST_KITCHEN', 'DESSERT_PARLOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE halal_classification AS ENUM ('FULL_HALAL_MONITORED', 'FULL_HALAL_OWNER_VERIFIED', 'PARTIAL_HALAL_OPTIONS', 'MUSLIM_OWNED_NO_CERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'diner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Halal Certifying Bodies Master Registry
CREATE TABLE IF NOT EXISTS certifying_bodies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    short_code VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    website_url VARCHAR(255),
    is_globally_recognized BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    venue_type venue_type NOT NULL DEFAULT 'RESTAURANT',
    halal_classification halal_classification NOT NULL DEFAULT 'FULL_HALAL_MONITORED',
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    phone_number VARCHAR(50),
    website_url VARCHAR(255),
    image_url TEXT,
    is_alcohol_free BOOLEAN DEFAULT true,
    has_prayer_space BOOLEAN DEFAULT false,
    has_separate_prep_area BOOLEAN DEFAULT true,
    is_hand_slaughtered_only BOOLEAN DEFAULT false,
    verification_status verification_status DEFAULT 'UNVERIFIED',
    average_rating NUMERIC(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Halal Certificates Table
CREATE TABLE IF NOT EXISTS halal_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    certifying_body_id UUID REFERENCES certifying_bodies(id) ON DELETE SET NULL,
    certificate_number VARCHAR(100),
    issued_date DATE,
    expiration_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    ai_raw_extraction JSONB,
    ai_confidence_score NUMERIC(5, 2),
    is_active BOOLEAN DEFAULT true,
    verified_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_halal_certified BOOLEAN DEFAULT true,
    contains_alcohol BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    halal_authenticity_rating INT CHECK (halal_authenticity_rating >= 1 AND halal_authenticity_rating <= 5),
    photo_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Dynamic Performance
CREATE INDEX IF NOT EXISTS idx_venues_spatial ON venues(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_status ON venues(verification_status);
CREATE INDEX IF NOT EXISTS idx_certificates_venue ON halal_certificates(venue_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_venue ON menu_items(venue_id);
CREATE INDEX IF NOT EXISTS idx_reviews_venue ON reviews(venue_id);
