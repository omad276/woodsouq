'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LayoutDashboard, Package, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function UserMenu() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80">
          <Avatar className="h-8 w-8 bg-wood">
            <AvatarFallback className="bg-wood text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{profile?.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {profile?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <LayoutDashboard className="h-4 w-4" />
          <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('dashboard')}</span>
        </DropdownMenuItem>
        {profile?.role === 'seller' && (
          <DropdownMenuItem onClick={() => router.push('/dashboard/listings')}>
            <Package className="h-4 w-4" />
            <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('myListings')}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="h-4 w-4" />
          <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="h-4 w-4" />
          <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
