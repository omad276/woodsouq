'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Mail, Check, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';

interface Inquiry {
  id: string;
  sender_name: string;
  sender_email: string;
  listing_id: string | null;
  listing_title?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  listing?: {
    title: string;
  };
}

export default function InquiriesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch inquiries from Supabase
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('inquiries')
          .select('*, listing:listings(title)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch inquiries:', error);
        } else {
          const formattedData = (data || []).map((inq) => ({
            ...inq,
            listing_title: inq.listing?.title || t('generalInquiry'),
          }));
          setInquiries(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user]);

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.listing_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  const markAsRead = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from('inquiries')
        .update({ is_read: true })
        .eq('id', id);

      setInquiries(
        inquiries.map((inq) =>
          inq.id === id ? { ...inq, is_read: true } : inq
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('justNow');
    if (hours < 24) return `${hours} ${t('hoursAgo')}`;
    if (days < 7) return `${days} ${t('daysAgo')}`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">{t('inquiries')}</h1>
        <p className="text-muted-foreground">
          {t('manageInquiries')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {t('allInquiries')}
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-wood">{unreadCount} {t('new')}</Badge>
                  )}
                </CardTitle>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchInquiriesPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredInquiries.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('noInquiriesYetShort')}</p>
                </div>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredInquiries.map((inquiry) => (
                    <button
                      key={inquiry.id}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                        selectedInquiry?.id === inquiry.id ? 'bg-muted' : ''
                      } ${!inquiry.is_read ? 'bg-wood/5' : ''}`}
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        if (!inquiry.is_read) markAsRead(inquiry.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium truncate ${!inquiry.is_read ? 'text-wood-dark' : ''}`}>
                              {inquiry.sender_name}
                            </p>
                            {!inquiry.is_read && (
                              <span className="w-2 h-2 rounded-full bg-wood flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {inquiry.listing_title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {inquiry.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(inquiry.created_at)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Detail */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedInquiry.sender_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedInquiry.sender_email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDate(selectedInquiry.created_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t('regarding')}:
                  </p>
                  <Badge variant="outline">{selectedInquiry.listing_title}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {t('message')}:
                  </p>
                  <p className="text-foreground whitespace-pre-line">
                    {selectedInquiry.message}
                  </p>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button
                    className="bg-wood hover:bg-wood-dark"
                    onClick={() => window.location.href = `mailto:${selectedInquiry.sender_email}`}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {t('replyViaEmail')}
                  </Button>
                  {!selectedInquiry.is_read && (
                    <Button variant="outline" onClick={() => markAsRead(selectedInquiry.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      {t('markAsRead')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('selectInquiryToView')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
