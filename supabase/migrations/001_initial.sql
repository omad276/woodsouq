-- TimberLink Database Schema v1
-- MVP: Users, Listings, Suppliers, Reviews, Inquiries

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'designer', 'manufacturer', 'admin');

-- Listing types enum
CREATE TYPE listing_type AS ENUM ('timber', 'wood_product');

-- Listing status enum
CREATE TYPE listing_status AS ENUM ('active', 'draft', 'sold', 'archived');

-- Review target types enum
CREATE TYPE review_target_type AS ENUM ('listing', 'supplier');

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'buyer',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===========================================
-- SUPPLIERS TABLE
-- ===========================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  description TEXT,
  country VARCHAR(100) NOT NULL,
  certifications JSONB DEFAULT '[]',
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policies for suppliers
CREATE POLICY "Suppliers are viewable by everyone"
  ON suppliers FOR SELECT
  USING (true);

CREATE POLICY "Sellers can create their supplier profile"
  ON suppliers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers can update own profile"
  ON suppliers FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- LISTINGS TABLE
-- ===========================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_type listing_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  wood_type VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  country_origin VARCHAR(100),
  grade VARCHAR(50),
  status listing_status NOT NULL DEFAULT 'draft',
  images JSONB DEFAULT '[]',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policies for listings
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Sellers can create listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = seller_id);

-- Index for faster searches
CREATE INDEX idx_listings_type ON listings(listing_type);
CREATE INDEX idx_listings_wood_type ON listings(wood_type);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_country ON listings(country_origin);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created ON listings(created_at DESC);

-- ===========================================
-- REVIEWS TABLE
-- ===========================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type review_target_type NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reviewer_id, target_id, target_type)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- Index for faster lookups
CREATE INDEX idx_reviews_target ON reviews(target_id, target_type);

-- ===========================================
-- INQUIRIES TABLE
-- ===========================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(120) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for inquiries
CREATE POLICY "Sellers can view their inquiries"
  ON inquiries FOR SELECT
  USING (auth.uid() = seller_id OR auth.uid() = sender_id);

CREATE POLICY "Anyone can create inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can update their inquiries (mark read)"
  ON inquiries FOR UPDATE
  USING (auth.uid() = seller_id);

-- Index for faster lookups
CREATE INDEX idx_inquiries_seller ON inquiries(seller_id);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update listing timestamp
CREATE OR REPLACE FUNCTION update_listing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for listing updates
CREATE TRIGGER on_listing_update
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_listing_timestamp();

-- Function to get supplier rating
CREATE OR REPLACE FUNCTION get_supplier_rating(supplier_uuid UUID)
RETURNS TABLE (avg_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(AVG(rating)::NUMERIC, 0) AS avg_rating,
    COUNT(*) AS review_count
  FROM reviews
  WHERE target_id = supplier_uuid AND target_type = 'supplier';
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- STORAGE BUCKET FOR IMAGES
-- ===========================================
-- Run this in Supabase Dashboard > Storage:
-- 1. Create bucket named 'listings' (public)
-- 2. Create bucket named 'suppliers' (public)
