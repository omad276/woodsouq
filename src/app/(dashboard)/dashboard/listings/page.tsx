'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal, Pencil, Eye, Trash2, Loader2 } from 'lucide-react';
import type { Listing } from '@/types';
import { useAuth } from '@/components/auth';

// Mock data
const mockListings: (Listing & { views: number })[] = [
  {
    id: '1',
    seller_id: '1',
    listing_type: 'timber',
    title: 'Premium Oak Lumber - Kiln Dried',
    description: 'High-quality kiln-dried oak lumber.',
    wood_type: 'Oak',
    category: 'Hardwood',
    price: 850,
    currency: 'USD',
    quantity: 100,
    unit: 'm³',
    country_origin: 'Germany',
    grade: 'A',
    status: 'active',
    images: [],
    created_at: '2024-01-15T10:00:00Z',
    views: 234,
  },
  {
    id: '2',
    seller_id: '1',
    listing_type: 'timber',
    title: 'Swedish Pine Boards',
    description: 'Sustainably sourced Swedish pine boards.',
    wood_type: 'Pine',
    category: 'Softwood',
    price: 420,
    currency: 'USD',
    quantity: 200,
    unit: 'm³',
    country_origin: 'Sweden',
    grade: 'B',
    status: 'active',
    images: [],
    created_at: '2024-01-10T10:00:00Z',
    views: 156,
  },
  {
    id: '3',
    seller_id: '1',
    listing_type: 'wood_product',
    title: 'Engineered Oak Flooring',
    description: 'Premium engineered oak flooring.',
    wood_type: 'Oak',
    category: 'Flooring',
    price: 85,
    currency: 'USD',
    quantity: 500,
    unit: 'sqm',
    country_origin: 'Poland',
    grade: 'Select',
    status: 'draft',
    images: [],
    created_at: '2024-01-05T10:00:00Z',
    views: 0,
  },
  {
    id: '4',
    seller_id: '1',
    listing_type: 'timber',
    title: 'Indonesian Teak Logs',
    description: 'Premium Indonesian teak logs.',
    wood_type: 'Teak',
    category: 'Logs',
    price: 1200,
    currency: 'USD',
    quantity: 0,
    unit: 'm³',
    country_origin: 'Indonesia',
    grade: 'Premium',
    status: 'sold',
    images: [],
    created_at: '2024-01-01T10:00:00Z',
    views: 567,
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  sold: 'bg-blue-100 text-blue-800',
  archived: 'bg-red-100 text-red-800',
};

export default function ListingsPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [listings, setListings] = useState<(Listing & { views?: number })[]>(mockListings);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch real listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings?seller_id=me');
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setListings(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };
    if (profile) {
      fetchListings();
    }
  }, [profile]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    setDeleting(id);
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setListings(listings.filter((l) => l.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete listing');
      }
    } catch {
      alert('Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">My Listings</h1>
          <p className="text-muted-foreground">
            Manage your timber and wood product listings
          </p>
        </div>
        <Button className="bg-wood hover:bg-wood-dark" asChild>
          <Link href="/dashboard/listings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Listing
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Listings ({listings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {listing.wood_type} · {listing.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {listing.listing_type === 'timber' ? 'Timber' : 'Product'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${listing.price.toLocaleString()}/{listing.unit}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[listing.status]}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{(listing.views || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(listing.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => router.push(`/marketplace/${listing.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleDelete(listing.id);
                          }}
                          disabled={deleting === listing.id}
                        >
                          {deleting === listing.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
