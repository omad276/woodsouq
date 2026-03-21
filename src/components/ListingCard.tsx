'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { t, isRTL } = useLanguage();
  const imageUrl = listing.images?.[0] || '/images/placeholder-wood.jpg';
  const href = listing.listing_type === 'timber'
    ? `/marketplace/${listing.id}`
    : `/products/${listing.id}`;

  return (
    <Link href={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-[4/3] relative bg-muted">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <Badge
            className={`absolute top-2 bg-wood hover:bg-wood ${isRTL ? 'right-2' : 'left-2'}`}
            variant="secondary"
          >
            {listing.category || listing.wood_type}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {listing.description}
          </p>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {listing.country_origin}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-wood ltr-only">
              ${listing.price.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('per')} {listing.unit}
            </p>
          </div>
          {listing.seller && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.5</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
