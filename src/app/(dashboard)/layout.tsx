'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Home,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WoodSouqLogo } from '@/components/ui/woodsouq-logo';
import { useLanguage } from '@/lib/i18n';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { href: '/dashboard', label: t('overview'), icon: LayoutDashboard, sellerOnly: false },
    { href: '/dashboard/listings', label: t('myListings'), icon: Package, sellerOnly: true },
    { href: '/dashboard/listings/new', label: t('addListing'), icon: PlusCircle, sellerOnly: true },
    { href: '/dashboard/inquiries', label: t('inquiries'), icon: MessageSquare, sellerOnly: true },
    { href: '/dashboard/profile', label: t('profile'), icon: User, sellerOnly: false },
  ];

  // Filter links based on user role
  const visibleLinks = sidebarLinks.filter(
    (link) => !link.sellerOnly || profile?.role !== 'buyer'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar - Always visible */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <WoodSouqLogo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/marketplace" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-700">
                <ShoppingBag className="h-4 w-4" />
                {t('marketplace')}
              </Link>
              <Link href="/suppliers" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-700">
                <Users className="h-4 w-4" />
                {t('suppliers')}
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-green-700">
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard')}
              </Link>
            </nav>

            {/* Right side - User info */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  {t('welcome')}, {profile?.name?.split(' ')[0]}
                </span>
                <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.name?.charAt(0) || 'U'}
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4 px-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-medium">{profile?.name}</p>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                <Home className="h-4 w-4" />
                {t('home')}
              </Link>
              <Link href="/marketplace" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingBag className="h-4 w-4" />
                {t('marketplace')}
              </Link>
              <Link href="/suppliers" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                <Users className="h-4 w-4" />
                {t('suppliers')}
              </Link>
              <hr className="my-2" />
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md',
                    pathname === link.href ? 'bg-green-700 text-white' : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <button
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md w-full"
                onClick={() => { setMobileMenuOpen(false); signOut(); }}
              >
                <LogOut className="h-4 w-4" />
                {t('signOut')}
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Desktop only */}
        <aside className="w-64 bg-white border-r border-border hidden md:flex md:flex-col">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <p className="font-medium text-foreground truncate">{profile?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-wood/10 text-wood rounded">
              {profile?.role}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-wood text-white'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('signOut')}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
