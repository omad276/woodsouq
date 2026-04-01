'use client';

import { useLanguage } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import {
  Globe,
  Shield,
  Users,
  Target,
  Eye,
  Mail,
  CheckCircle
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('verifiedSuppliers'),
      description: t('verifiedSuppliersDesc'),
    },
    {
      icon: Globe,
      title: t('globalReach'),
      description: t('globalReachDesc'),
    },
    {
      icon: CheckCircle,
      title: t('secureTransactions'),
      description: t('secureTransactionsDesc'),
    },
    {
      icon: Users,
      title: t('bilingualSupport'),
      description: t('bilingualSupportDesc'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wood-dark via-wood to-wood-light py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('aboutUsTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('aboutUsSubtitle')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
            {t('aboutUsIntro')}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">{t('ourStory')}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t('ourStoryText')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-2 border-wood/20 hover:border-wood/40 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-wood/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-wood" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{t('ourMission')}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('ourMissionText')}
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-2 border-wood/20 hover:border-wood/40 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-wood/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-wood" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{t('ourVision')}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('ourVisionText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t('whyChooseUs')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-wood/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-wood" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-wood text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contactUs')}</h2>
          <p className="text-xl text-white/80 mb-8">{t('contactUsText')}</p>
          <a
            href="mailto:esmailabdelrazig@gmail.com"
            className="inline-flex items-center gap-2 bg-white text-wood px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/90 transition-colors"
          >
            <Mail className="h-5 w-5" />
            esmailabdelrazig@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
