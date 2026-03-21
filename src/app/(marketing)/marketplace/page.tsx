import { createClient } from '@/lib/supabase/server';
import { MarketplaceContent } from '@/components/marketplace/MarketplaceContent';
import type { Listing } from '@/types';

export const metadata = {
  title: 'Timber Marketplace - TimberLink',
  description: 'Browse and buy timber from verified suppliers worldwide. Find hardwood, softwood, plywood, logs, and more.',
};

async function getListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('listing_type', 'timber')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    return [];
  }

  return data || [];
}

export default async function MarketplacePage() {
  const listings = await getListings();

  return <MarketplaceContent listings={listings} />;
}
