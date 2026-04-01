import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ListingDetailContent } from '@/components/ListingDetailContent';
import type { Listing, Supplier } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('listings')
    .select('title')
    .eq('id', id)
    .single();

  return {
    title: data?.title ? `${data.title} - WoodSouq` : 'Listing - WoodSouq',
    description: 'View timber listing details',
  };
}

async function getListing(id: string): Promise<{ listing: Listing; supplier: Supplier | null } | null> {
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !listing) {
    return null;
  }

  // Get supplier info
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', listing.seller_id)
    .single();

  return { listing, supplier };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getListing(id);

  if (!result) {
    notFound();
  }

  const { listing, supplier } = result;

  return (
    <ListingDetailContent
      listing={listing}
      supplier={supplier}
      backLink="/marketplace"
      backLinkKey="backToMarketplace"
      supplierLabelKey="supplier"
    />
  );
}
