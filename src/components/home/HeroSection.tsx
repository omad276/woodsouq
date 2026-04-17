'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function HeroSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-16 md:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-8" asChild>
            <Link href="/marketplace">
              {t('browseListings')}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl px-8 shadow-lg shadow-amber-500/30"
            asChild
          >
            <Link href="/become-supplier">
              <Star className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('joinAsSupplier')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
