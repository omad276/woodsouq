'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth';
import { useLanguage } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import { Package, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import type { Listing, Inquiry } from '@/types';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  draftListings: number;
  soldListings: number;
  totalInquiries: number;
  unreadInquiries: number;
  respondedInquiries: number;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    draftListings: 0,
    soldListings: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    respondedInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<(Inquiry & { listing?: Listing })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;

      const supabase = createClient();

      // Fetch listings for this seller
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id);

      if (listingsError) {
        console.error('Error fetching listings:', listingsError);
      }

      // Fetch inquiries for this seller
      const { data: inquiries, error: inquiriesError } = await supabase
        .from('inquiries')
        .select(`
          *,
          listing:listings(id, title)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (inquiriesError) {
        console.error('Error fetching inquiries:', inquiriesError);
      }

      // Calculate stats
      const listingsArr = listings || [];
      const inquiriesArr = inquiries || [];

      setStats({
        totalListings: listingsArr.length,
        activeListings: listingsArr.filter(l => l.status === 'active').length,
        draftListings: listingsArr.filter(l => l.status === 'draft').length,
        soldListings: listingsArr.filter(l => l.status === 'sold').length,
        totalInquiries: inquiriesArr.length,
        unreadInquiries: inquiriesArr.filter(i => !i.is_read).length,
        respondedInquiries: inquiriesArr.filter(i => i.is_read).length,
      });

      // Set recent inquiries (top 5)
      setRecentInquiries(inquiriesArr.slice(0, 5));
      setLoading(false);
    }

    fetchDashboardData();
  }, [user?.id]);

  // Calculate response rate
  const responseRate = stats.totalInquiries > 0
    ? Math.round((stats.respondedInquiries / stats.totalInquiries) * 100)
    : 0;

  const statsCards = [
    {
      title: t('totalListings'),
      value: loading ? '...' : stats.totalListings.toString(),
      icon: Package,
      description: loading ? '' : `${stats.activeListings} ${t('active')}, ${stats.draftListings} ${t('draft')}, ${stats.soldListings} ${t('sold')}`,
    },
    {
      title: t('activeListings'),
      value: loading ? '...' : stats.activeListings.toString(),
      icon: CheckCircle,
      description: loading ? '' : t('visibleToBuyers'),
    },
    {
      title: t('inquiries'),
      value: loading ? '...' : stats.totalInquiries.toString(),
      icon: MessageSquare,
      description: loading ? '' : `${stats.unreadInquiries} ${t('unread')}`,
    },
    {
      title: t('conversionRate'),
      value: loading ? '...' : `${responseRate}%`,
      icon: TrendingUp,
      description: loading ? '' : t('responseRate'),
    },
  ];

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
    return `${diffDays} ${t('daysAgo')}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">
          {t('welcome')}, {profile?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          {t('activityOverview')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-wood" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentInquiries')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('loading')}
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noInquiriesYet')}
            </div>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    !inquiry.is_read ? 'bg-wood/5 border-wood/20' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{inquiry.sender_name}</p>
                      {!inquiry.is_read && (
                        <span className="px-2 py-0.5 text-xs bg-wood text-white rounded">
                          {t('new')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('re')} {inquiry.listing?.title || t('generalInquiry')}
                    </p>
                    <p className="text-sm text-foreground mt-1 line-clamp-1">
                      {inquiry.message}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(inquiry.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {profile?.role === 'seller' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a
                href="/dashboard/listings/new"
                className="px-4 py-2 bg-wood text-white rounded-md hover:bg-wood-dark transition-colors"
              >
                {t('createNewListing')}
              </a>
              <a
                href="/dashboard/listings"
                className="px-4 py-2 border border-wood text-wood rounded-md hover:bg-wood/10 transition-colors"
              >
                {t('manageListings')}
              </a>
              <a
                href="/dashboard/inquiries"
                className="px-4 py-2 border border-wood text-wood rounded-md hover:bg-wood/10 transition-colors"
              >
                {t('viewAllInquiries')}
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
