import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Seed users data
const users = [
  {
    email: 'erik@nordictimber.example.com',
    password: 'seedpassword123',
    name: 'Erik Lindqvist',
    role: 'seller',
  },
  {
    email: 'carlos@amazonhardwoods.example.com',
    password: 'seedpassword123',
    name: 'Carlos Silva',
    role: 'seller',
  },
  {
    email: 'michael@pnwlumber.example.com',
    password: 'seedpassword123',
    name: 'Michael Johnson',
    role: 'seller',
  },
];

const suppliersData = [
  {
    company_name: 'Nordic Timber Co.',
    logo_url: null,
    description: 'Premium Scandinavian timber supplier specializing in sustainably harvested pine and spruce from certified Swedish forests. Over 50 years of experience in the timber industry.',
    country: 'Sweden',
    certifications: ['FSC', 'PEFC', 'ISO 14001'],
    website: 'https://nordictimber.example.com',
  },
  {
    company_name: 'Amazon Hardwoods Brazil',
    logo_url: null,
    description: 'Leading exporter of premium tropical hardwoods including Ipe, Cumaru, and Mahogany. All products legally sourced with full chain of custody documentation.',
    country: 'Brazil',
    certifications: ['FSC', 'IBAMA Registered', 'Rainforest Alliance'],
    website: 'https://amazonhardwoods.example.com',
  },
  {
    company_name: 'Pacific Northwest Lumber',
    logo_url: null,
    description: 'Family-owned sawmill operating since 1952. Specializing in Douglas Fir, Western Red Cedar, and specialty cuts for construction and fine woodworking.',
    country: 'United States',
    certifications: ['SFI Certified', 'NHLA Member'],
    website: 'https://pnwlumber.example.com',
  },
];

const listingsData = [
  {
    userIndex: 0,
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
    images: [],
  },
  {
    userIndex: 1,
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
    images: [],
  },
  {
    userIndex: 2,
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
    images: [],
  },
  {
    userIndex: 0,
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
    images: [],
  },
  {
    userIndex: 1,
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
    images: [],
  },
];

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed not allowed in production' }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results: {
    users: string[];
    suppliers: number;
    listings: number;
    errors: string[];
  } = { users: [], suppliers: 0, listings: 0, errors: [] };

  const userIds: string[] = [];

  // Step 1: Create auth users
  for (const user of users) {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === user.email);

    if (existingUser) {
      userIds.push(existingUser.id);
      results.users.push(`${user.email} (existing)`);
      continue;
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role,
      }
    });

    if (authError) {
      results.errors.push(`Auth user ${user.email}: ${authError.message}`);
      continue;
    }

    if (authData?.user) {
      userIds.push(authData.user.id);
      results.users.push(user.email);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_verified: true,
        }, { onConflict: 'id' });

      if (profileError) {
        results.errors.push(`Profile ${user.email}: ${profileError.message}`);
      }
    }
  }

  if (userIds.length === 0) {
    return NextResponse.json({
      success: false,
      message: 'No users created',
      ...results
    }, { status: 400 });
  }

  // Step 2: Create suppliers
  for (let i = 0; i < suppliersData.length && i < userIds.length; i++) {
    const supplier = suppliersData[i];
    const { error: supplierError } = await supabase
      .from('suppliers')
      .upsert({
        user_id: userIds[i],
        ...supplier
      }, { onConflict: 'user_id' });

    if (supplierError) {
      results.errors.push(`Supplier ${supplier.company_name}: ${supplierError.message}`);
    } else {
      results.suppliers++;
    }
  }

  // Step 3: Create listings
  for (const listing of listingsData) {
    const { userIndex, ...listingFields } = listing;
    if (userIds[userIndex]) {
      const { error: listingError } = await supabase
        .from('listings')
        .insert({
          seller_id: userIds[userIndex],
          ...listingFields
        });

      if (listingError) {
        results.errors.push(`Listing ${listing.title}: ${listingError.message}`);
      } else {
        results.listings++;
      }
    }
  }

  if (results.errors.length > 0) {
    return NextResponse.json({
      success: false,
      message: 'Seed completed with some errors',
      ...results
    }, { status: 207 });
  }

  return NextResponse.json({
    success: true,
    message: 'Seed completed successfully',
    ...results
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to run seed',
    endpoint: '/api/seed',
    method: 'POST'
  });
}
