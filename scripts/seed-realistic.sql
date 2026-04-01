-- TimberLink Realistic Seed Data
-- Run this in Supabase SQL Editor with service role context
-- This script creates 5 suppliers and 15 listings

-- ===================================================
-- STEP 1: Create Auth Users using Supabase Auth Admin
-- Run each insert separately if needed
-- ===================================================

-- Create supplier users in auth.users
-- Note: In production, use auth.admin.createUser() API instead

DO $$
DECLARE
  uae_user_id UUID := gen_random_uuid();
  saudi_user_id UUID := gen_random_uuid();
  malaysia_user_id UUID := gen_random_uuid();
  brazil_user_id UUID := gen_random_uuid();
  finland_user_id UUID := gen_random_uuid();
BEGIN
  -- Insert into auth.users (requires service_role)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    aud,
    role
  )
  VALUES
    (
      uae_user_id,
      '00000000-0000-0000-0000-000000000000',
      'supplier.uae@timberlink.com',
      crypt('Supplier123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('name', 'Ahmed Al-Rashid', 'role', 'seller'),
      NOW(),
      NOW(),
      '',
      'authenticated',
      'authenticated'
    ),
    (
      saudi_user_id,
      '00000000-0000-0000-0000-000000000000',
      'supplier.saudi@timberlink.com',
      crypt('Supplier123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('name', 'Khalid bin Mohammed', 'role', 'seller'),
      NOW(),
      NOW(),
      '',
      'authenticated',
      'authenticated'
    ),
    (
      malaysia_user_id,
      '00000000-0000-0000-0000-000000000000',
      'supplier.malaysia@timberlink.com',
      crypt('Supplier123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('name', 'Tan Wei Ming', 'role', 'seller'),
      NOW(),
      NOW(),
      '',
      'authenticated',
      'authenticated'
    ),
    (
      brazil_user_id,
      '00000000-0000-0000-0000-000000000000',
      'supplier.brazil@timberlink.com',
      crypt('Supplier123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('name', 'Carlos Eduardo Santos', 'role', 'seller'),
      NOW(),
      NOW(),
      '',
      'authenticated',
      'authenticated'
    ),
    (
      finland_user_id,
      '00000000-0000-0000-0000-000000000000',
      'supplier.finland@timberlink.com',
      crypt('Supplier123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('name', 'Mikko Virtanen', 'role', 'seller'),
      NOW(),
      NOW(),
      '',
      'authenticated',
      'authenticated'
    )
  ON CONFLICT (email) DO NOTHING;

  -- Profiles are auto-created by trigger, but let's ensure they exist
  INSERT INTO profiles (id, name, email, role, is_verified, created_at)
  VALUES
    (uae_user_id, 'Ahmed Al-Rashid', 'supplier.uae@timberlink.com', 'seller', true, NOW()),
    (saudi_user_id, 'Khalid bin Mohammed', 'supplier.saudi@timberlink.com', 'seller', true, NOW()),
    (malaysia_user_id, 'Tan Wei Ming', 'supplier.malaysia@timberlink.com', 'seller', true, NOW()),
    (brazil_user_id, 'Carlos Eduardo Santos', 'supplier.brazil@timberlink.com', 'seller', true, NOW()),
    (finland_user_id, 'Mikko Virtanen', 'supplier.finland@timberlink.com', 'seller', true, NOW())
  ON CONFLICT (id) DO NOTHING;

  -- ===================================================
  -- STEP 2: Create Supplier Profiles
  -- ===================================================
  INSERT INTO suppliers (user_id, company_name, description, country, certifications, website)
  VALUES
    (
      uae_user_id,
      'Emirates Timber Trading LLC',
      'Leading timber importer and distributor in the UAE, serving construction and furniture industries across the GCC. We specialize in premium hardwoods from sustainable sources and offer custom cutting services.',
      'United Arab Emirates',
      '["ISO 9001", "Dubai Chamber of Commerce", "Green Building Council"]'::jsonb,
      'https://emiratestimber.ae'
    ),
    (
      saudi_user_id,
      'Al-Madinah Wood Industries',
      'Premier wood products manufacturer in Saudi Arabia with state-of-the-art facilities in Jeddah. Specializing in engineered wood products, MDF panels, and custom architectural millwork for mega projects.',
      'Saudi Arabia',
      '["SASO Certified", "ISO 14001", "Saudi Contractor Authority"]'::jsonb,
      'https://madinahwood.sa'
    ),
    (
      malaysia_user_id,
      'Borneo Tropical Hardwoods Sdn Bhd',
      'Established in 1985, we are one of Malaysia''s largest exporters of tropical hardwoods including Meranti, Keruing, and Merbau. All products sourced from legally certified Malaysian forests with full documentation.',
      'Malaysia',
      '["MTCC Certified", "PEFC", "Malaysian Timber Council"]'::jsonb,
      'https://borneohardwoods.my'
    ),
    (
      brazil_user_id,
      'Madeiras do Sul Exportadora',
      'Family-owned Brazilian timber exporter since 1962. Specializing in premium tropical hardwoods including Ipe, Cumaru, Jatoba, and Tigerwood. Full chain of custody documentation and sustainable harvesting practices.',
      'Brazil',
      '["FSC", "IBAMA DOF", "Rainforest Alliance", "CERFLOR"]'::jsonb,
      'https://madeirasul.com.br'
    ),
    (
      finland_user_id,
      'Nordic Pine & Spruce Oy',
      'Finnish timber producer specializing in slow-grown Nordic softwoods with exceptional density and grain quality. Our kiln-dried lumber meets the highest European standards for construction and joinery applications.',
      'Finland',
      '["PEFC Finland", "FSC", "CE Marking", "ISO 14001"]'::jsonb,
      'https://nordicpine.fi'
    )
  ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    description = EXCLUDED.description,
    country = EXCLUDED.country,
    certifications = EXCLUDED.certifications,
    website = EXCLUDED.website;

  -- ===================================================
  -- STEP 3: Create 15 Product Listings (all status='active')
  -- ===================================================

  -- UAE Supplier Listings (3)
  INSERT INTO listings (seller_id, listing_type, title, description, wood_type, category, price, currency, quantity, unit, country_origin, grade, status, images)
  VALUES
    (
      uae_user_id,
      'timber',
      'Premium Teak Lumber - Kiln Dried Grade A',
      'Imported premium Burmese Teak, kiln dried to 10-12% moisture content. Ideal for luxury furniture, yacht building, and high-end interior applications. Golden brown color with excellent natural oils for durability.',
      'Teak',
      'Hardwood',
      3200,
      'USD',
      50,
      'm³',
      'Myanmar',
      'A',
      'active',
      '[]'::jsonb
    ),
    (
      uae_user_id,
      'wood_product',
      'White Oak Flooring Planks - Engineered',
      'Premium engineered white oak flooring with 4mm wear layer. UV-cured finish for durability. Tongue and groove installation. Perfect for residential and commercial projects in the GCC region.',
      'Oak',
      'Flooring',
      85,
      'USD',
      5000,
      'sqm',
      'Germany',
      'Select',
      'active',
      '[]'::jsonb
    ),
    (
      uae_user_id,
      'timber',
      'African Padauk Timber Logs',
      'Vibrant red-orange African Padauk timber, freshly imported. Excellent for decorative woodworking, musical instruments, and statement furniture pieces. Air dried, ready for processing.',
      'Padauk',
      'Hardwood',
      1800,
      'USD',
      30,
      'm³',
      'Cameroon',
      'Premium',
      'active',
      '[]'::jsonb
    );

  -- Saudi Arabia Supplier Listings (3)
  INSERT INTO listings (seller_id, listing_type, title, description, wood_type, category, price, currency, quantity, unit, country_origin, grade, status, images)
  VALUES
    (
      saudi_user_id,
      'wood_product',
      'MDF Panels - Moisture Resistant E1',
      'High-density moisture-resistant MDF panels manufactured to European E1 emission standards. 18mm thickness, ideal for kitchen cabinets, bathroom vanities, and interior millwork in humid climates.',
      'MDF',
      'Panels',
      32,
      'USD',
      10000,
      'piece',
      'Saudi Arabia',
      'E1',
      'active',
      '[]'::jsonb
    ),
    (
      saudi_user_id,
      'wood_product',
      'Laminated Veneer Lumber (LVL) Beams',
      'Structural LVL beams for construction applications. High strength-to-weight ratio, consistent quality without natural defects. Available in standard and custom lengths up to 24 meters.',
      'Pine',
      'Engineered',
      580,
      'USD',
      200,
      'm³',
      'Finland',
      'Structural',
      'active',
      '[]'::jsonb
    ),
    (
      saudi_user_id,
      'wood_product',
      'Walnut Wood Veneer Sheets',
      'Premium American Black Walnut veneer sheets. 0.6mm thickness, backed for easy application. Rich chocolate brown color with distinctive grain patterns. Perfect for luxury furniture and wall paneling.',
      'Walnut',
      'Veneer',
      65,
      'USD',
      3000,
      'sqm',
      'United States',
      'AA',
      'active',
      '[]'::jsonb
    );

  -- Malaysia Supplier Listings (3)
  INSERT INTO listings (seller_id, listing_type, title, description, wood_type, category, price, currency, quantity, unit, country_origin, grade, status, images)
  VALUES
    (
      malaysia_user_id,
      'timber',
      'Meranti Red Lumber - Sawn Timber',
      'Dark Red Meranti sawn timber, one of Southeast Asia''s most popular hardwoods. Excellent workability, moderate durability. Ideal for furniture, doors, windows, and general construction. MTCC certified sustainable.',
      'Meranti',
      'Hardwood',
      420,
      'USD',
      300,
      'm³',
      'Malaysia',
      'Standard & Better',
      'active',
      '[]'::jsonb
    ),
    (
      malaysia_user_id,
      'timber',
      'Merbau Decking Boards - Pre-Grooved',
      'Premium Merbau decking boards with anti-slip grooves. Naturally durable Class 1 hardwood with rich reddish-brown color. Perfect for outdoor decks, pool surrounds, and commercial walkways.',
      'Merbau',
      'Decking',
      1450,
      'USD',
      80,
      'm³',
      'Malaysia',
      'Select',
      'active',
      '[]'::jsonb
    ),
    (
      malaysia_user_id,
      'timber',
      'Keruing Heavy Construction Timber',
      'Dense Keruing hardwood for heavy-duty construction applications. Excellent for marine work, truck beds, container flooring, and industrial applications. High mechanical strength and natural durability.',
      'Keruing',
      'Hardwood',
      380,
      'USD',
      500,
      'm³',
      'Malaysia',
      'Utility',
      'active',
      '[]'::jsonb
    );

  -- Brazil Supplier Listings (3)
  INSERT INTO listings (seller_id, listing_type, title, description, wood_type, category, price, currency, quantity, unit, country_origin, grade, status, images)
  VALUES
    (
      brazil_user_id,
      'timber',
      'Brazilian Ipe Hardwood - Decking Grade',
      'Genuine Brazilian Ipe, the ultimate decking hardwood. Janka hardness 3680, naturally resistant to rot, decay, and insects. Will last 40+ years outdoors without treatment. FSC certified sustainable harvest.',
      'Ipe',
      'Hardwood',
      3500,
      'USD',
      100,
      'm³',
      'Brazil',
      'Premium',
      'active',
      '[]'::jsonb
    ),
    (
      brazil_user_id,
      'timber',
      'Cumaru Golden Teak Alternative',
      'Brazilian Cumaru, often called "Brazilian Teak" for its similar appearance at a fraction of the cost. Excellent durability, beautiful golden-brown color. Perfect for decking and outdoor furniture.',
      'Cumaru',
      'Hardwood',
      1850,
      'USD',
      150,
      'm³',
      'Brazil',
      'Select',
      'active',
      '[]'::jsonb
    ),
    (
      brazil_user_id,
      'timber',
      'Jatoba Cherry Flooring Blanks',
      'Brazilian Cherry (Jatoba) flooring blanks ready for milling. Rich reddish-brown color that deepens with age. Extremely hard and durable. Ideal for high-traffic residential and commercial flooring.',
      'Jatoba',
      'Hardwood',
      1200,
      'USD',
      200,
      'm³',
      'Brazil',
      'Clear',
      'active',
      '[]'::jsonb
    );

  -- Finland Supplier Listings (3)
  INSERT INTO listings (seller_id, listing_type, title, description, wood_type, category, price, currency, quantity, unit, country_origin, grade, status, images)
  VALUES
    (
      finland_user_id,
      'timber',
      'Finnish Spruce Structural Timber C24',
      'Slow-grown Finnish spruce, strength graded C24 to EN 14081. Kiln dried to 18% MC. Excellent dimensional stability and workability. Perfect for timber frame construction, roof trusses, and general building.',
      'Spruce',
      'Softwood',
      320,
      'USD',
      1000,
      'm³',
      'Finland',
      'C24',
      'active',
      '[]'::jsonb
    ),
    (
      finland_user_id,
      'timber',
      'Nordic Redwood Pine - Joinery Grade',
      'Premium Finnish Redwood pine selected for joinery applications. Minimal knots, straight grain, excellent finish quality. Kiln dried to 12% MC. Ideal for windows, doors, and interior trim.',
      'Pine',
      'Softwood',
      480,
      'USD',
      400,
      'm³',
      'Finland',
      'Joinery',
      'active',
      '[]'::jsonb
    ),
    (
      finland_user_id,
      'wood_product',
      'Birch Plywood Baltic Grade BB/BB',
      'Premium Finnish birch plywood with BB/BB face grades. 15-ply cross-laminated construction for superior strength and stability. Perfect for furniture, cabinetry, CNC machining, and architectural applications.',
      'Birch',
      'Plywood',
      95,
      'USD',
      3000,
      'piece',
      'Finland',
      'BB/BB',
      'active',
      '[]'::jsonb
    );

  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created 5 suppliers from UAE, Saudi Arabia, Malaysia, Brazil, and Finland';
  RAISE NOTICE 'Created 15 active listings';

END $$;

-- ===================================================
-- VERIFICATION QUERIES
-- ===================================================

SELECT 'SUPPLIERS' as table_name, COUNT(*) as count FROM suppliers;
SELECT 'LISTINGS' as table_name, COUNT(*) as count FROM listings WHERE status = 'active';

-- Show supplier summary
SELECT
  s.company_name,
  s.country,
  COUNT(l.id) as listing_count
FROM suppliers s
LEFT JOIN profiles p ON s.user_id = p.id
LEFT JOIN listings l ON l.seller_id = p.id
GROUP BY s.company_name, s.country
ORDER BY s.country;

-- Show listings summary
SELECT
  l.title,
  l.wood_type,
  l.price,
  l.currency,
  l.country_origin,
  l.status
FROM listings l
WHERE l.status = 'active'
ORDER BY l.created_at DESC;
