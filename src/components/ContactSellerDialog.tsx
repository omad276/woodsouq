'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface ContactSellerDialogProps {
  sellerId: string;
  listingId?: string;
  listingTitle?: string;
  sellerName?: string;
}

export function ContactSellerDialog({
  sellerId,
  listingId,
  listingTitle,
  sellerName,
}: ContactSellerDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: sellerId,
          listing_id: listingId,
          sender_name: formData.name,
          sender_email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send inquiry');
      }

      setSuccess(true);
      // Reset form
      setFormData({ name: '', email: '', message: '' });

      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-wood hover:bg-wood-dark">
          <MessageSquare className="h-4 w-4" />
          <span className="ltr:ml-2 rtl:mr-2">{t('contactSupplier')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('sendInquiry')}</DialogTitle>
          <DialogDescription>
            {listingTitle
              ? `Send a message about "${listingTitle}"${sellerName ? ` to ${sellerName}` : ''}`
              : `Contact ${sellerName || 'seller'} with your inquiry`}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Inquiry Sent!</h3>
            <p className="text-muted-foreground mt-2">
              The seller will receive your message via email and can respond directly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{t('fullName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('namePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('emailPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={`Hi, I'm interested in ${listingTitle ? `"${listingTitle}"` : 'your products'}. I would like to know more about...`}
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" className="bg-wood hover:bg-wood-dark" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />}
                {t('sendInquiry')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
