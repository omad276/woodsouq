import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ListingCard } from '@/components/ListingCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wood-dark">Timber Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Browse timber from verified suppliers worldwide
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <Suspense fallback={<div className="w-64 h-96 bg-muted animate-pulse rounded" />}>
          <FilterSidebar type="timber" />
        </Suspense>

        {/* Listings Grid */}
        <div className="flex-1">
          {/* Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {listings.length} listings
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="most_viewed">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No timber listings found.</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="mt-8 flex justify-center">
            <p className="text-sm text-muted-foreground">
              Showing page 1 of 1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
