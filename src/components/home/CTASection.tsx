'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-wood">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {t('readyToStart')}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          {t('ctaSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-wood hover:bg-white/90" asChild>
            <Link href="/register">{t('createFreeAccount')}</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link href="/suppliers">{t('exploreSuppliers')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
