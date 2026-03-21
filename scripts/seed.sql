-- TimberLink Seed Data
-- Run this in the Supabase SQL Editor

-- First, create test users in the profiles table (assumes auth users exist or will be created)
-- You may need to create auth users first via the Supabase dashboard

-- Insert Suppliers
INSERT INTO suppliers (id, user_id, company_name, logo_url, description, country, certifications, website)
VALUES
  (
    'sup-001',
    'user-seed-001',
    'Nordic Timber Co.',
    NULL,
    'Premium Scandinavian timber supplier specializing in sustainably harvested pine and spruce from certified Swedish forests. Over 50 years of experience in the timber industry.',
    'Sweden',
    ARRAY['FSC', 'PEFC', 'ISO 14001'],
    'https://nordictimber.example.com'
  ),
  (
    'sup-002',
    'user-seed-002',
    'Amazon Hardwoods Brazil',
    NULL,
    'Leading exporter of premium tropical hardwoods including Ipe, Cumaru, and Mahogany. All products legally sourced with full chain of custody documentation.',
    'Brazil',
    ARRAY['FSC', 'IBAMA Registered', 'Rainforest Alliance'],
    'https://amazonhardwoods.example.com'
  ),
  (
    'sup-003',
    'user-seed-003',
    'Pacific Northwest Lumber',
    NULL,
    'Family-owned sawmill operating since 1952. Specializing in Douglas Fir, Western Red Cedar, and specialty cuts for construction and fine woodworking.',
    'United States',
    ARRAY['SFI Certified', 'NHLA Member'],
    'https://pnwlumber.example.com'
  )
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  description = EXCLUDED.description,
  country = EXCLUDED.country,
  certifications = EXCLUDED.certifications,
  website = EXCLUDED.website;

-- Insert Listings
INSERT INTO listings (id, seller_id, listing_type, title, description, wood_type, category, price, currency, quantity, unit, country_origin, grade, status, images)
VALUES
  (
    'lst-001',
    'user-seed-001',
    'timber',
    'Premium Swedish Pine Lumber - Kiln Dried',
    'High-quality Swedish pine lumber, kiln dried to 12% moisture content. Perfect for construction, furniture making, and interior applications. Available in various dimensions. Sustainably harvested from FSC-certified forests.',
    'Pine',
    'Softwood',
    450,
    'USD',
    500,
    'm³',
    'Sweden',
    'A',
    'active',
    ARRAY['/images/seed/swedish-pine.jpg']
  ),
  (
    'lst-002',
    'user-seed-002',
    'timber',
    'Brazilian Ipe Decking Boards',
    'Genuine Brazilian Ipe hardwood, known as "ironwood" for its exceptional durability. Perfect for outdoor decking, dock construction, and high-traffic commercial applications. Natural resistance to rot, decay, and insects.',
    'Other',
    'Hardwood',
    2800,
    'USD',
    150,
    'm³',
    'Brazil',
    'Select',
    'active',
    ARRAY['/images/seed/ipe-decking.jpg']
  ),
  (
    'lst-003',
    'user-seed-003',
    'timber',
    'Douglas Fir Construction Timber',
    'Premium Douglas Fir timber ideal for structural applications, post and beam construction, and timber framing. Known for exceptional strength-to-weight ratio. Available in standard and custom dimensions.',
    'Fir',
    'Lumber',
    680,
    'USD',
    800,
    'm³',
    'United States',
    'Premium',
    'active',
    ARRAY['/images/seed/douglas-fir.jpg']
  ),
  (
    'lst-004',
    'user-seed-001',
    'timber',
    'Finnish Birch Plywood Sheets',
    'High-grade Baltic birch plywood manufactured in Finland. 13-ply construction for exceptional strength and stability. Ideal for furniture, cabinetry, and architectural applications. Smooth sanded faces.',
    'Birch',
    'Plywood',
    85,
    'USD',
    2000,
    'piece',
    'Finland',
    'B',
    'active',
    ARRAY['/images/seed/birch-plywood.jpg']
  ),
  (
    'lst-005',
    'user-seed-002',
    'timber',
    'Mahogany Veneer Sheets - Book Matched',
    'Exquisite genuine mahogany veneer sheets, book-matched for symmetrical grain patterns. Perfect for high-end furniture, musical instruments, and luxury interior applications. Each sheet hand-selected for quality.',
    'Mahogany',
    'Veneer',
    45,
    'USD',
    500,
    'sqm',
    'Brazil',
    'Premium',
    'active',
    ARRAY['/images/seed/mahogany-veneer.jpg']
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  wood_type = EXCLUDED.wood_type,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity,
  unit = EXCLUDED.unit,
  country_origin = EXCLUDED.country_origin,
  grade = EXCLUDED.grade,
  status = EXCLUDED.status,
  images = EXCLUDED.images;

-- Verify the data
SELECT 'Suppliers inserted:' as info, COUNT(*) as count FROM suppliers WHERE id LIKE 'sup-%';
SELECT 'Listings inserted:' as info, COUNT(*) as count FROM listings WHERE id LIKE 'lst-%';
