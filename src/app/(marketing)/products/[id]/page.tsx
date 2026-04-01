import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ListingDetailContent } from '@/components/ListingDetailContent';
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
    title: data?.title ? `${data.title} - WoodSouq` : 'Product - WoodSouq',
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
    <ListingDetailContent
      listing={product}
      supplier={supplier}
      backLink="/products"
      backLinkKey="backToProducts"
      supplierLabelKey="manufacturer"
    />
  );
}
