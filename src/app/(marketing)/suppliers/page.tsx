import { createClient } from '@/lib/supabase/server';
import { SuppliersContent } from '@/components/suppliers/SuppliersContent';
import type { Supplier } from '@/types';

export const metadata = {
  title: 'Supplier Directory - WoodSouq',
  description: 'Find verified timber and wood product suppliers from around the world.',
};

async function getSuppliers(): Promise<Supplier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('company_name', { ascending: true });

  if (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }

  return data || [];
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return <SuppliersContent suppliers={suppliers} />;
}
