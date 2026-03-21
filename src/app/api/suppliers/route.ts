import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/suppliers - List suppliers
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  const country = searchParams.get('country');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'rating';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

  // Build query
  let query = supabase
    .from('suppliers')
    .select('*', { count: 'exact' });

  // Apply filters
  if (country) {
    query = query.eq('country', country);
  }
  if (search) {
    query = query.or(`company_name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply sorting
  switch (sort) {
    case 'name':
      query = query.order('company_name', { ascending: true });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'rating':
    default:
      query = query.order('created_at', { ascending: false }); // Would use rating if computed
  }

  // Apply pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Compute ratings for each supplier (in production, this would be a view or computed column)
  const suppliersWithRatings = await Promise.all(
    (data || []).map(async (supplier) => {
      const { data: ratingData } = await supabase.rpc('get_supplier_rating', {
        supplier_uuid: supplier.id,
      });
      return {
        ...supplier,
        rating: ratingData?.[0]?.avg_rating || 0,
        review_count: ratingData?.[0]?.review_count || 0,
      };
    })
  );

  return NextResponse.json({
    data: suppliersWithRatings,
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}
