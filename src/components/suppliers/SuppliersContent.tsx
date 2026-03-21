'use client';

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
import { useLanguage } from '@/lib/i18n';
import type { Supplier } from '@/types';

interface SuppliersContentProps {
  suppliers: Supplier[];
}

export function SuppliersContent({ suppliers }: SuppliersContentProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wood-dark">{t('supplierDirectory')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('supplierDirectorySubtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            type="search"
            placeholder={t('searchSuppliers')}
            className={isRTL ? 'pr-10' : 'pl-10'}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t('country')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCountries')}</SelectItem>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="rating">
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">{t('highestRated')}</SelectItem>
            <SelectItem value="reviews">{t('mostReviews')}</SelectItem>
            <SelectItem value="newest">{t('newest')}</SelectItem>
            <SelectItem value="name">{t('nameAZ')}</SelectItem>
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
          <p className="text-muted-foreground">{t('noSuppliersFound')}</p>
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t('showingSuppliers')} {suppliers.length} {t('suppliersCount')}
        </p>
      </div>
    </div>
  );
}
