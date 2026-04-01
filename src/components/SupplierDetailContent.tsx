'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ListingCard } from '@/components/ListingCard';
import { MapPin, Star, Globe, Building2, ArrowLeft, MessageSquare, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Supplier, Listing, Review } from '@/types';

interface SupplierDetailContentProps {
  supplier: Supplier;
  listings: Listing[];
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function SupplierDetailContent({
  supplier,
  listings,
  reviews,
}: SupplierDetailContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/suppliers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-wood mb-6"
      >
        <ArrowLeft className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
        {t('backToSuppliers')}
      </Link>

      {/* Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-wood-dark">
                    {supplier.company_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {supplier.country}
                    </div>
                    {supplier.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-wood hover:underline"
                        >
                          {t('website')}
                        </a>
                      </div>
                    )}
                  </div>
                  {supplier.rating !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={Math.round(supplier.rating)} />
                      <span className="font-medium">{supplier.rating}</span>
                      <span className="text-muted-foreground">
                        ({supplier.review_count || 0} {t('reviews')})
                      </span>
                    </div>
                  )}
                </div>
                <Button className="bg-wood hover:bg-wood-dark">
                  <MessageSquare className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                  {t('contactSupplier')}
                </Button>
              </div>
              {supplier.certifications && supplier.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {supplier.certifications.map((cert: string, i: number) => (
                    <Badge key={i} variant="outline" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">{t('products')} ({listings.length})</TabsTrigger>
          <TabsTrigger value="about">{t('about')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('reviews')} ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noProductsYet')}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>{t('about')} {supplier.company_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {supplier.description || t('noDescriptionProvided')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{review.reviewer?.name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <Separator className="my-3" />
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noReviewsYet')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
