import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ListingFilters } from '@/types';

// GET /api/listings - List listings with filters
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // Parse filters
  const filters: ListingFilters = {
    listing_type: searchParams.get('listing_type') as 'timber' | 'wood_product' | undefined,
    wood_type: searchParams.get('wood_type') || undefined,
    category: searchParams.get('category') || undefined,
    country_origin: searchParams.get('country') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    min_quantity: searchParams.get('min_quantity') ? Number(searchParams.get('min_quantity')) : undefined,
    grade: searchParams.get('grade') || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as ListingFilters['sort']) || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
  };

  // Build query
  let query = supabase
    .from('listings')
    .select('*, profiles!seller_id(id, name, email)', { count: 'exact' })
    .eq('status', 'active');

  // Apply filters
  if (filters.listing_type) {
    query = query.eq('listing_type', filters.listing_type);
  }
  if (filters.wood_type) {
    query = query.eq('wood_type', filters.wood_type);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.country_origin) {
    query = query.eq('country_origin', filters.country_origin);
  }
  if (filters.grade) {
    query = query.eq('grade', filters.grade);
  }
  if (filters.min_price !== undefined) {
    query = query.gte('price', filters.min_price);
  }
  if (filters.max_price !== undefined) {
    query = query.lte('price', filters.max_price);
  }
  if (filters.min_quantity !== undefined) {
    query = query.gte('quantity', filters.min_quantity);
  }
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'most_viewed':
      query = query.order('view_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'country_origin', 'price', 'wood_type', 'category', 'unit', 'quantity'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Auth Error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Check if user is a seller
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile Error:', profileError);
      return NextResponse.json(
        { error: 'Failed to verify user role', details: profileError.message },
        { status: 500 }
      );
    }

    if (profile?.role !== 'seller' && profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only sellers can create listings' },
        { status: 403 }
      );
    }

    // Insert listing
    const { data, error } = await supabase
      .from('listings')
      .insert({
        seller_id: user.id,
        listing_type: body.listing_type || 'timber',
        title: body.title,
        description: body.description || '',
        wood_type: body.wood_type,
        category: body.category,
        price: body.price,
        currency: body.currency || 'USD',
        quantity: body.quantity,
        unit: body.unit,
        country_origin: body.country_origin,
        grade: body.grade || null,
        status: body.status || 'draft',
        images: body.images || [],
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase Insert Error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    console.log('✅ Listing created successfully:', data.id);
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
