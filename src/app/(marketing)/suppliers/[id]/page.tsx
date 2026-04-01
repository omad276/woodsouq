import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SupplierDetailContent } from '@/components/SupplierDetailContent';
import type { Supplier, Listing, Review } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('suppliers')
    .select('company_name')
    .eq('id', id)
    .single();

  return {
    title: data?.company_name ? `${data.company_name} - WoodSouq` : 'Supplier - WoodSouq',
    description: 'View supplier profile and products',
  };
}

async function getSupplierData(id: string): Promise<{
  supplier: Supplier;
  listings: Listing[];
  reviews: Review[];
} | null> {
  const supabase = await createClient();

  // Get supplier
  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !supplier) {
    return null;
  }

  // Get supplier's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', supplier.user_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  // Get reviews for this supplier
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles(*)')
    .eq('target_id', id)
    .eq('target_type', 'supplier')
    .order('created_at', { ascending: false });

  return {
    supplier,
    listings: listings || [],
    reviews: reviews || [],
  };
}

export default async function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSupplierData(id);

  if (!result) {
    notFound();
  }

  const { supplier, listings, reviews } = result;

  return (
    <SupplierDetailContent
      supplier={supplier}
      listings={listings}
      reviews={reviews}
    />
  );
}
