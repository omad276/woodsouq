'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wood-dark via-wood to-wood-light py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('contactPageTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('contactPageSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-2 border-wood/20">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contactFormName')}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('contactFormNamePlaceholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contactFormEmail')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('contactFormEmailPlaceholder')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contactFormMessage')}</Label>
                    <Textarea
                      id="message"
                      placeholder={t('contactFormMessagePlaceholder')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>

                  {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span>{t('contactFormSuccess')}</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <span>{t('contactFormError')}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-wood hover:bg-wood-dark text-white"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? t('contactFormSending') : t('contactFormSubmit')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t('contactInfo')}</h2>

                <Card className="border-2 border-wood/20 mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-wood/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-wood" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{t('contactEmailLabel')}</h3>
                        <a
                          href="mailto:esmailabdelrazig@gmail.com"
                          className="text-wood hover:text-wood-dark transition-colors"
                        >
                          esmailabdelrazig@gmail.com
                        </a>
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('contactResponseTime')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-wood/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-wood/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-wood" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{t('contactOfficeHours')}</h3>
                        <p className="text-muted-foreground">
                          {t('contactOfficeHoursValue')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
