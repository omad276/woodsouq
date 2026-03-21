import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles!seller_id(id, name, email),
      suppliers!inner(id, company_name, logo_url, description, country, certifications, website)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment view count
  await supabase
    .from('listings')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', id);

  return NextResponse.json(data);
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check ownership
  const { data: listing } = await supabase
    .from('listings')
    .select('seller_id')
    .eq('id', id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.seller_id !== user.id) {
    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('listings')
      .update({
        listing_type: body.listing_type,
        title: body.title,
        description: body.description,
        wood_type: body.wood_type,
        category: body.category,
        price: body.price,
        currency: body.currency,
        quantity: body.quantity,
        unit: body.unit,
        country_origin: body.country_origin,
        grade: body.grade,
        status: body.status,
        images: body.images,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check ownership
  const { data: listing } = await supabase
    .from('listings')
    .select('seller_id')
    .eq('id', id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.seller_id !== user.id) {
    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
