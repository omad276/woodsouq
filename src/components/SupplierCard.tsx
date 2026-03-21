'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Building2 } from 'lucide-react';
import type { Supplier } from '@/types';

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const logoUrl = supplier.logo_url || '/images/placeholder-company.jpg';

  return (
    <Link href={`/suppliers/${supplier.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {supplier.logo_url ? (
                <Image
                  src={logoUrl}
                  alt={supplier.company_name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {supplier.company_name}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {supplier.country}
              </div>
              {supplier.rating !== undefined && (
                <div className="flex items-center gap-1 mt-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{supplier.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({supplier.review_count} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
          {supplier.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-4">
              {supplier.description}
            </p>
          )}
          {supplier.certifications && supplier.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {supplier.certifications.slice(0, 3).map((cert, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
