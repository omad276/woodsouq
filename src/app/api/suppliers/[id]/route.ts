import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/suppliers/[id] - Get a single supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get supplier rating
  const { data: ratingData } = await supabase.rpc('get_supplier_rating', {
    supplier_uuid: id,
  });

  // Get supplier's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', supplier.user_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  // Get supplier reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles!reviewer_id(id, name, email)')
    .eq('target_id', id)
    .eq('target_type', 'supplier')
    .order('created_at', { ascending: false });

  return NextResponse.json({
    ...supplier,
    rating: ratingData?.[0]?.avg_rating || 0,
    review_count: ratingData?.[0]?.review_count || 0,
    listings: listings || [],
    reviews: reviews || [],
  });
}
