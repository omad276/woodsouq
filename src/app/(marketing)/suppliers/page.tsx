import { createClient } from '@/lib/supabase/server';
import { SupplierCard } from '@/components/SupplierCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { COUNTRIES } from '@/types';
import type { Supplier } from '@/types';

export const metadata = {
  title: 'Supplier Directory - TimberLink',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wood-dark">Supplier Directory</h1>
        <p className="text-muted-foreground mt-2">
          Find verified timber and wood product suppliers worldwide
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="rating">
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suppliers Grid */}
      {suppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No suppliers found.</p>
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-muted-foreground">
          Showing {suppliers.length} suppliers
        </p>
      </div>
    </div>
  );
}
