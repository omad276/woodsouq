'use client';

import { Suspense } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ListingCard } from '@/components/ListingCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n';
import type { Listing } from '@/types';

interface MarketplaceContentProps {
  listings: Listing[];
}

export function MarketplaceContent({ listings }: MarketplaceContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wood-dark">{t('timberMarketplace')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('browseTimberSubtitle')}
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
              {t('showing')} {listings.length} {t('listings')}
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('newest')}</SelectItem>
                <SelectItem value="price_asc">{t('priceLowToHigh')}</SelectItem>
                <SelectItem value="price_desc">{t('priceHighToLow')}</SelectItem>
                <SelectItem value="most_viewed">{t('mostViewed')}</SelectItem>
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
              <p className="text-muted-foreground">{t('noTimberListings')}</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="mt-8 flex justify-center">
            <p className="text-sm text-muted-foreground">
              {t('showingPage')} 1 {t('of')} 1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
