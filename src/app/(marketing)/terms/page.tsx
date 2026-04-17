'use client';

import { useLanguage } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  const { t } = useLanguage();

  const sections = [
    { title: t('termsSection1Title'), content: t('termsSection1Content') },
    { title: t('termsSection2Title'), content: t('termsSection2Content') },
    { title: t('termsSection3Title'), content: t('termsSection3Content') },
    { title: t('termsSection4Title'), content: t('termsSection4Content') },
    { title: t('termsSection5Title'), content: t('termsSection5Content') },
    { title: t('termsSection6Title'), content: t('termsSection6Content') },
    { title: t('termsSection7Title'), content: t('termsSection7Content') },
    { title: t('termsSection8Title'), content: t('termsSection8Content') },
    { title: t('termsSection9Title'), content: t('termsSection9Content') },
    { title: t('termsSection10Title'), content: t('termsSection10Content') },
    { title: t('termsSection11Title'), content: t('termsSection11Content') },
    { title: t('termsSection12Title'), content: t('termsSection12Content') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wood-dark via-wood to-wood-light py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('termsOfServiceTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('termsOfServiceSubtitle')}
          </p>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold">{t('termsLastUpdated')}:</span> March 22, 2026
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('termsIntro')}
          </p>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="border-2 border-wood/20 bg-wood/5">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t('termsSection13Title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('termsSection13Content')}
                </p>
                <a
                  href="mailto:esmailabdelrazig@gmail.com"
                  className="inline-flex items-center gap-2 text-wood hover:text-wood-dark transition-colors font-semibold"
                >
                  <Mail className="h-5 w-5" />
                  esmailabdelrazig@gmail.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} WoodSouq. {t('allRightsReserved')}
          </p>
        </div>
      </section>
    </div>
  );
}
