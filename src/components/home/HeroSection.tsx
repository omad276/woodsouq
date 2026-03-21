'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function HeroSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative bg-wood-dark py-24 md:py-32">
      <div className="absolute inset-0 bg-[url('/images/hero-timber.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {t('heroTitle')}
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-wood hover:bg-wood-accent text-white" asChild>
            <Link href="/marketplace">
              {t('browseListings')}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link href="/register">
              {t('becomeSupplier')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
