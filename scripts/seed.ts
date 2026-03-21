/**
 * Seed script for TimberLink database
 * Run with: npx tsx scripts/seed.ts
 *
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Seed Suppliers
const suppliers = [
  {
    id: 'sup-001',
    user_id: 'user-seed-001',
    company_name: 'Nordic Timber Co.',
    logo_url: null,
    description: 'Premium Scandinavian timber supplier specializing in sustainably harvested pine and spruce from certified Swedish forests. Over 50 years of experience in the timber industry.',
    country: 'Sweden',
    certifications: ['FSC', 'PEFC', 'ISO 14001'],
    website: 'https://nordictimber.example.com',
  },
  {
    id: 'sup-002',
    user_id: 'user-seed-002',
    company_name: 'Amazon Hardwoods Brazil',
    logo_url: null,
    description: 'Leading exporter of premium tropical hardwoods including Ipe, Cumaru, and Mahogany. All products legally sourced with full chain of custody documentation.',
    country: 'Brazil',
    certifications: ['FSC', 'IBAMA Registered', 'Rainforest Alliance'],
    website: 'https://amazonhardwoods.example.com',
  },
  {
    id: 'sup-003',
    user_id: 'user-seed-003',
    company_name: 'Pacific Northwest Lumber',
    logo_url: null,
    description: 'Family-owned sawmill operating since 1952. Specializing in Douglas Fir, Western Red Cedar, and specialty cuts for construction and fine woodworking.',
    country: 'United States',
    certifications: ['SFI Certified', 'NHLA Member'],
    website: 'https://pnwlumber.example.com',
  },
];

// Seed Listings
const listings = [
  {
    id: 'lst-001',
    seller_id: 'user-seed-001',
    listing_type: 'timber',
    title: 'Premium Swedish Pine Lumber - Kiln Dried',
    description: 'High-quality Swedish pine lumber, kiln dried to 12% moisture content. Perfect for construction, furniture making, and interior applications. Available in various dimensions. Sustainably harvested from FSC-certified forests.',
    wood_type: 'Pine',
    category: 'Softwood',
    price: 450,
    currency: 'USD',
    quantity: 500,
    unit: 'm³',
    country_origin: 'Sweden',
    grade: 'A',
    status: 'active',
    images: ['/images/seed/swedish-pine.jpg'],
  },
  {
    id: 'lst-002',
    seller_id: 'user-seed-002',
    listing_type: 'timber',
    title: 'Brazilian Ipe Decking Boards',
    description: 'Genuine Brazilian Ipe hardwood, known as "ironwood" for its exceptional durability. Perfect for outdoor decking, dock construction, and high-traffic commercial applications. Natural resistance to rot, decay, and insects.',
    wood_type: 'Other',
    category: 'Hardwood',
    price: 2800,
    currency: 'USD',
    quantity: 150,
    unit: 'm³',
    country_origin: 'Brazil',
    grade: 'Select',
    status: 'active',
    images: ['/images/seed/ipe-decking.jpg'],
  },
  {
    id: 'lst-003',
    seller_id: 'user-seed-003',
    listing_type: 'timber',
    title: 'Douglas Fir Construction Timber',
    description: 'Premium Douglas Fir timber ideal for structural applications, post and beam construction, and timber framing. Known for exceptional strength-to-weight ratio. Available in standard and custom dimensions.',
    wood_type: 'Fir',
    category: 'Lumber',
    price: 680,
    currency: 'USD',
    quantity: 800,
    unit: 'm³',
    country_origin: 'United States',
    grade: 'Premium',
    status: 'active',
    images: ['/images/seed/douglas-fir.jpg'],
  },
  {
    id: 'lst-004',
    seller_id: 'user-seed-001',
    listing_type: 'timber',
    title: 'Finnish Birch Plywood Sheets',
    description: 'High-grade Baltic birch plywood manufactured in Finland. 13-ply construction for exceptional strength and stability. Ideal for furniture, cabinetry, and architectural applications. Smooth sanded faces.',
    wood_type: 'Birch',
    category: 'Plywood',
    price: 85,
    currency: 'USD',
    quantity: 2000,
    unit: 'piece',
    country_origin: 'Finland',
    grade: 'B',
    status: 'active',
    images: ['/images/seed/birch-plywood.jpg'],
  },
  {
    id: 'lst-005',
    seller_id: 'user-seed-002',
    listing_type: 'timber',
    title: 'Mahogany Veneer Sheets - Book Matched',
    description: 'Exquisite genuine mahogany veneer sheets, book-matched for symmetrical grain patterns. Perfect for high-end furniture, musical instruments, and luxury interior applications. Each sheet hand-selected for quality.',
    wood_type: 'Mahogany',
    category: 'Veneer',
    price: 45,
    currency: 'USD',
    quantity: 500,
    unit: 'sqm',
    country_origin: 'Brazil',
    grade: 'Premium',
    status: 'active',
    images: ['/images/seed/mahogany-veneer.jpg'],
  },
];

async function seed() {
  console.log('🌱 Starting seed...');

  // First, create seed users in auth (or use existing user IDs)
  // For simplicity, we'll insert suppliers and listings with placeholder user IDs
  // In production, you'd create actual users first

  // Insert suppliers
  console.log('📦 Inserting suppliers...');
  const { data: suppliersData, error: suppliersError } = await supabase
    .from('suppliers')
    .upsert(suppliers, { onConflict: 'id' })
    .select();

  if (suppliersError) {
    console.error('Error inserting suppliers:', suppliersError);
  } else {
    console.log(`✅ Inserted ${suppliersData?.length || 0} suppliers`);
  }

  // Insert listings
  console.log('📋 Inserting listings...');
  const { data: listingsData, error: listingsError } = await supabase
    .from('listings')
    .upsert(listings, { onConflict: 'id' })
    .select();

  if (listingsError) {
    console.error('Error inserting listings:', listingsError);
  } else {
    console.log(`✅ Inserted ${listingsData?.length || 0} listings`);
  }

  console.log('🎉 Seed completed!');
}

seed().catch(console.error);
