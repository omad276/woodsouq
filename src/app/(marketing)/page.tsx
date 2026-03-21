import { createClient } from '@/lib/supabase/server';
import {
  HeroSection,
  CategoriesSection,
  FeaturedListingsSection,
  FeaturedSuppliersSection,
  CTASection,
} from '@/components/home';
import type { Listing, Supplier } from '@/types';

async function getFeaturedData(): Promise<{ listings: Listing[]; suppliers: Supplier[] }> {
  const supabase = await createClient();

  // Get featured listings (latest 4 active)
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4);

  // Get featured suppliers (first 4)
  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('*')
    .order('company_name', { ascending: true })
    .limit(4);

  return {
    listings: listings || [],
    suppliers: suppliers || [],
  };
}

export default async function HomePage() {
  const { listings, suppliers } = await getFeaturedData();

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedListingsSection listings={listings} />
      <FeaturedSuppliersSection suppliers={suppliers} />
      <CTASection />
    </div>
  );
}
