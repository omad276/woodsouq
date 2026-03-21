'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SupplierCard } from '@/components/SupplierCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Supplier } from '@/types';

interface FeaturedSuppliersSectionProps {
  suppliers: Supplier[];
}

export function FeaturedSuppliersSection({ suppliers }: FeaturedSuppliersSectionProps) {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-wood-dark">
            {t('featuredSuppliers')}
          </h2>
          <Button variant="ghost" className="text-wood" asChild>
            <Link href="/suppliers">
              {t('viewAll')}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
        </div>
        {suppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('noSuppliersYet')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
