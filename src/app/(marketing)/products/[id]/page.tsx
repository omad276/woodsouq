import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package, Ruler, Star, Building2, ArrowLeft } from 'lucide-react';
import { ContactSellerDialog } from '@/components/ContactSellerDialog';
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
    title: data?.title ? `${data.title} - TimberLink` : 'Product - TimberLink',
    description: 'View wood product details',
  };
}

async function getProduct(id: string): Promise<{ product: Listing; supplier: Supplier | null } | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return null;
  }

  // Get supplier info
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', product.seller_id)
    .single();

  return { product, supplier };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProduct(id);

  if (!result) {
    notFound();
  }

  const { product, supplier } = result;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-wood mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              {product.images && product.images.length > 0 ? (
                <div className="aspect-video relative rounded-t-lg overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
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
                  <Badge className="mb-2 bg-wood">{product.category}</Badge>
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {product.country_origin}
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  {product.quantity} {product.unit} available
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Material</p>
                    <p className="font-medium">{product.wood_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="font-medium">{product.grade || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unit</p>
                    <p className="font-medium">{product.unit}</p>
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
                  ${Number(product.price).toLocaleString()}
                </p>
                <p className="text-muted-foreground">per {product.unit}</p>
              </div>
              <div className="mt-6">
                <ContactSellerDialog
                  sellerId={product.seller_id}
                  listingId={product.id}
                  listingTitle={product.title}
                  sellerName={supplier?.company_name}
                />
              </div>
            </CardContent>
          </Card>

          {/* Supplier Card */}
          {supplier && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manufacturer</CardTitle>
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
                          ({supplier.review_count} reviews)
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
                    View Supplier Profile
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
