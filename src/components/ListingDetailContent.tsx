'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package, Ruler, Star, Building2, ArrowLeft } from 'lucide-react';
import { ContactSellerDialog } from '@/components/ContactSellerDialog';
import { useLanguage } from '@/lib/i18n';
import type { Listing, Supplier } from '@/types';

interface ListingDetailContentProps {
  listing: Listing;
  supplier: Supplier | null;
  backLink: string;
  backLinkKey: 'backToMarketplace' | 'backToProducts';
  supplierLabelKey: 'supplier' | 'manufacturer';
}

export function ListingDetailContent({
  listing,
  supplier,
  backLink,
  backLinkKey,
  supplierLabelKey,
}: ListingDetailContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href={backLink}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-wood mb-6"
      >
        <ArrowLeft className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
        {t(backLinkKey)}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              {listing.images && listing.images.length > 0 ? (
                <div className="aspect-video relative rounded-t-lg overflow-hidden">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-wood">{t(`category_${listing.category}` as keyof typeof import('@/lib/i18n/translations').translations.en)}</Badge>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {listing.country_origin}
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  {listing.quantity} {listing.unit} {t('available')}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">{t('description')}</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">{t('specifications')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {supplierLabelKey === 'manufacturer' ? t('material') : t('woodType')}
                    </p>
                    <p className="font-medium">{t(`woodType_${listing.wood_type}` as keyof typeof import('@/lib/i18n/translations').translations.en)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('category')}</p>
                    <p className="font-medium">{t(`category_${listing.category}` as keyof typeof import('@/lib/i18n/translations').translations.en)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('grade')}</p>
                    <p className="font-medium">{listing.grade || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('unit')}</p>
                    <p className="font-medium">{listing.unit}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-wood">
                  ${Number(listing.price).toLocaleString()}
                </p>
                <p className="text-muted-foreground">{t('per')} {listing.unit}</p>
              </div>
              <div className="mt-6">
                <ContactSellerDialog
                  sellerId={listing.seller_id}
                  listingId={listing.id}
                  listingTitle={listing.title}
                  sellerName={supplier?.company_name}
                />
              </div>
            </CardContent>
          </Card>

          {/* Supplier Card */}
          {supplier && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t(supplierLabelKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{supplier.company_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {supplier.country}
                    </div>
                    {supplier.rating !== undefined && (
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{supplier.rating}</span>
                        <span className="text-muted-foreground">
                          ({supplier.review_count} {t('reviews')})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {supplier.certifications && supplier.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {supplier.certifications.map((cert: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/suppliers/${supplier.id}`}>
                    {t('viewSupplierProfile')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
