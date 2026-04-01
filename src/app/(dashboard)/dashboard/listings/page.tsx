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
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  sold: 'bg-blue-100 text-blue-800',
  archived: 'bg-red-100 text-red-800',
};

export default function ListingsPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch user's listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch listings:', error);
        } else {
          setListings(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteListing'))) {
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
        alert(data.error || t('failedToDelete'));
      }
    } catch {
      alert(t('failedToDelete'));
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">{t('myListings')}</h1>
          <p className="text-muted-foreground">
            {t('manageYourListings')}
          </p>
        </div>
        <Button className="bg-wood hover:bg-wood-dark" asChild>
          <Link href="/dashboard/listings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addListing')}
          </Link>
        </Button>
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>{t('allListings')} ({listings.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-visible">
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{t('noListingsYetDashboard')}</p>
              <Button className="bg-wood hover:bg-wood-dark" asChild>
                <Link href="/dashboard/listings/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('createFirstListing')}
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('title')}</TableHead>
                  <TableHead>{t('type')}</TableHead>
                  <TableHead>{t('price')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('views')}</TableHead>
                  <TableHead>{t('created')}</TableHead>
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
                        {listing.listing_type === 'timber' ? t('timber') : t('product')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${listing.price.toLocaleString()}/{listing.unit}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[listing.status] || 'bg-gray-100 text-gray-800'}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{(listing.view_count || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(listing.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="relative z-10">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push(`/marketplace/${listing.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(listing.id)}
                            disabled={deleting === listing.id}
                          >
                            {deleting === listing.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
