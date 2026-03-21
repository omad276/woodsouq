'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import {
  TreePine,
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, sellerOnly: false },
  { href: '/dashboard/listings', label: 'My Listings', icon: Package, sellerOnly: true },
  { href: '/dashboard/listings/new', label: 'Add Listing', icon: PlusCircle, sellerOnly: true },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare, sellerOnly: true },
  { href: '/dashboard/profile', label: 'Profile', icon: User, sellerOnly: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  // Filter links based on user role
  const visibleLinks = sidebarLinks.filter(
    (link) => !link.sellerOnly || profile?.role !== 'buyer'
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:flex md:flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <TreePine className="h-8 w-8 text-wood" />
            <span className="text-xl font-bold text-wood-dark">TimberLink</span>
          </Link>
        </div>

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
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TreePine className="h-8 w-8 text-wood" />
              <span className="text-xl font-bold text-wood-dark">TimberLink</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
