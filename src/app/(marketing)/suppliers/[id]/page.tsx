import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ListingCard } from '@/components/ListingCard';
import { MapPin, Star, Globe, Building2, ArrowLeft, MessageSquare, Shield } from 'lucide-react';
import type { Supplier, Listing, Review } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('suppliers')
    .select('company_name')
    .eq('id', id)
    .single();

  return {
    title: data?.company_name ? `${data.company_name} - TimberLink` : 'Supplier - TimberLink',
    description: 'View supplier profile and products',
  };
}

async function getSupplierData(id: string): Promise<{
  supplier: Supplier;
  listings: Listing[];
  reviews: Review[];
} | null> {
  const supabase = await createClient();

  // Get supplier
  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !supplier) {
    return null;
  }

  // Get supplier's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', supplier.user_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  // Get reviews for this supplier
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles(*)')
    .eq('target_id', id)
    .eq('target_type', 'supplier')
    .order('created_at', { ascending: false });

  return {
    supplier,
    listings: listings || [],
    reviews: reviews || [],
  };
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

export default async function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSupplierData(id);

  if (!result) {
    notFound();
  }

  const { supplier, listings, reviews } = result;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/suppliers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-wood mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Suppliers
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
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                  {supplier.rating !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={Math.round(supplier.rating)} />
                      <span className="font-medium">{supplier.rating}</span>
                      <span className="text-muted-foreground">
                        ({supplier.review_count || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <Button className="bg-wood hover:bg-wood-dark">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Supplier
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
          <TabsTrigger value="products">Products ({listings.length})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
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
              <p className="text-muted-foreground">No products listed yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About {supplier.company_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {supplier.description || 'No description provided.'}
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
              <p className="text-muted-foreground">No reviews yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
