'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Listing } from '@/types';

interface FeaturedListingsSectionProps {
  listings: Listing[];
}

export function FeaturedListingsSection({ listings }: FeaturedListingsSectionProps) {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-wood-dark">
            {t('featuredListings')}
          </h2>
          <Button variant="ghost" className="text-wood" asChild>
            <Link href="/marketplace">
              {t('viewAll')}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
        </div>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('noListingsYet')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
