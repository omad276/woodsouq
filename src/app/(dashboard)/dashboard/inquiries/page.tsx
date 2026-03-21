'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Mail, Check, Clock } from 'lucide-react';

interface Inquiry {
  id: string;
  sender_name: string;
  sender_email: string;
  listing_id: string;
  listing_title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    sender_name: 'John Smith',
    sender_email: 'john.smith@example.com',
    listing_id: '1',
    listing_title: 'Premium Oak Lumber - Kiln Dried',
    message: 'Hi, I am interested in purchasing 50m³ of your oak lumber. Can you provide a quote for delivery to the UK? We are a furniture manufacturing company and looking for a long-term supplier.',
    is_read: false,
    created_at: '2024-03-15T14:30:00Z',
  },
  {
    id: '2',
    sender_name: 'ABC Construction Ltd.',
    sender_email: 'procurement@abcconstruction.com',
    listing_id: '2',
    listing_title: 'Swedish Pine Boards',
    message: 'Can you provide a quote for bulk orders? We need around 200m³ for a residential development project. Looking for delivery within 4 weeks.',
    is_read: false,
    created_at: '2024-03-15T10:15:00Z',
  },
  {
    id: '3',
    sender_name: 'Maria Garcia',
    sender_email: 'maria@designstudio.es',
    listing_id: '3',
    listing_title: 'Birch Plywood Sheets',
    message: 'Do you ship to Spain? Looking for plywood for a furniture project. Need approximately 100 sheets.',
    is_read: true,
    created_at: '2024-03-14T16:45:00Z',
  },
  {
    id: '4',
    sender_name: 'Green Building Co.',
    sender_email: 'orders@greenbuilding.de',
    listing_id: '2',
    listing_title: 'Swedish Pine Boards',
    message: 'We are looking for FSC certified timber for our eco-friendly construction projects. Can you confirm your certifications?',
    is_read: true,
    created_at: '2024-03-13T09:20:00Z',
  },
  {
    id: '5',
    sender_name: 'Tokyo Woodcraft',
    sender_email: 'info@tokyowoodcraft.jp',
    listing_id: '1',
    listing_title: 'Premium Oak Lumber',
    message: 'Very interested in your oak lumber. Can you ship to Japan? What are the lead times and minimum order quantities?',
    is_read: true,
    created_at: '2024-03-12T03:10:00Z',
  },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.listing_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  const markAsRead = (id: string) => {
    setInquiries(
      inquiries.map((inq) =>
        inq.id === id ? { ...inq, is_read: true } : inq
      )
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">Inquiries</h1>
        <p className="text-muted-foreground">
          Manage contact inquiries from potential buyers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  All Inquiries
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-wood">{unreadCount} new</Badge>
                  )}
                </CardTitle>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
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
                    Regarding:
                  </p>
                  <Badge variant="outline">{selectedInquiry.listing_title}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Message:
                  </p>
                  <p className="text-foreground whitespace-pre-line">
                    {selectedInquiry.message}
                  </p>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button className="bg-wood hover:bg-wood-dark">
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                  {!selectedInquiry.is_read && (
                    <Button variant="outline" onClick={() => markAsRead(selectedInquiry.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Read
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
                  Select an inquiry to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
