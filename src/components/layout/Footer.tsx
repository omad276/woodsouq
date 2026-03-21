'use client';

import Link from 'next/link';
import { TreePine } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <TreePine className="h-8 w-8 text-wood" />
              <span className="text-xl font-bold text-wood-dark">TimberLink</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footerDescription')}
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-semibold text-wood-dark mb-4">{t('marketplace')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-wood">
                  {t('timberListings')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-wood">
                  {t('woodProducts')}
                </Link>
              </li>
              <li>
                <Link href="/suppliers" className="text-sm text-muted-foreground hover:text-wood">
                  {t('suppliers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-wood-dark mb-4">{t('company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-wood">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-wood">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-wood">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-wood">
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold text-wood-dark mb-4">{t('forSellers')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-wood">
                  {t('becomeSupplier')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-wood">
                  {t('sellerDashboard')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TimberLink. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
