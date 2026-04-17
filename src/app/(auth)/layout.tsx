'use client';

import Link from 'next/link';
import { WoodSouqLogo } from '@/components/ui/woodsouq-logo';
import { useLanguage } from '@/lib/i18n';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <WoodSouqLogo size="md" />
            </Link>

            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/marketplace" className="text-sm font-medium text-gray-700 hover:text-green-700">
                {t('marketplace')}
              </Link>
              <Link href="/suppliers" className="text-sm font-medium text-gray-700 hover:text-green-700">
                {t('suppliers')}
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Link
                href="/login"
                className="text-sm font-medium text-green-700 hover:text-green-800"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800"
              >
                {t('signUp')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
