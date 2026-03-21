'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, TreePine } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { user, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { href: '/marketplace', label: t('marketplace') },
    { href: '/products', label: t('woodProducts') },
    { href: '/suppliers', label: t('suppliers') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <TreePine className="h-8 w-8 text-wood" />
            <span className="text-xl font-bold text-wood-dark">TimberLink</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="search"
                placeholder={t('search')}
                className={isRTL ? 'pr-10 w-full' : 'pl-10 w-full'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-wood transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <LanguageToggle />
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <Button className="bg-wood hover:bg-wood-dark" asChild>
                  <Link href="/register">{t('signUp')}</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  type="search"
                  placeholder={t('searchMobile')}
                  className={isRTL ? 'pr-10 w-full' : 'pl-10 w-full'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-2 text-sm font-medium text-foreground hover:text-wood"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="px-2 py-2 text-sm font-medium text-foreground hover:text-wood"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-2 py-2 text-sm font-medium text-wood"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('signUp')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
