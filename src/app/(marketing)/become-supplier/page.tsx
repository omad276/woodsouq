'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, TrendingUp, Users, Globe, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function BecomeSupplierPage() {
  const { t, isRTL } = useLanguage();

  const benefits = [
    {
      icon: Globe,
      title: 'Global Reach',
      titleAr: 'وصول عالمي',
      description: 'Connect with buyers from around the world',
      descriptionAr: 'تواصل مع مشترين من جميع أنحاء العالم',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      titleAr: 'نمّي أعمالك',
      description: 'Increase sales with our marketplace platform',
      descriptionAr: 'زد مبيعاتك عبر منصتنا',
    },
    {
      icon: Users,
      title: 'Verified Buyers',
      titleAr: 'مشترون موثقون',
      description: 'Access to verified and serious buyers',
      descriptionAr: 'وصول إلى مشترين موثقين وجادين',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      titleAr: 'منصة آمنة',
      description: 'Safe and secure transactions',
      descriptionAr: 'معاملات آمنة ومحمية',
    },
  ];

  const features = [
    { en: 'Free to list products', ar: 'إدراج المنتجات مجاني' },
    { en: 'Direct messaging with buyers', ar: 'رسائل مباشرة مع المشترين' },
    { en: 'Analytics dashboard', ar: 'لوحة تحليلات' },
    { en: 'Priority support', ar: 'دعم ذو أولوية' },
    { en: 'Featured listings option', ar: 'خيار القوائم المميزة' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-6">
            <Star className="h-5 w-5" />
            <span className="font-semibold">
              {isRTL ? 'انضم إلى شبكة الموردين' : 'Join Our Supplier Network'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {isRTL ? 'انضم كمورد الآن' : 'Become a WoodSouq Supplier'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {isRTL
              ? 'انضم إلى آلاف الموردين الذين يبيعون منتجاتهم الخشبية للمشترين في جميع أنحاء العالم'
              : 'Join thousands of suppliers selling their wood products to buyers worldwide'}
          </p>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl px-8 py-6 text-lg shadow-lg shadow-amber-500/30"
            asChild
          >
            <Link href="/register">
              <Star className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'سجّل الآن مجاناً' : 'Register Now - Free'}
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isRTL ? 'لماذا تنضم إلينا؟' : 'Why Join WoodSouq?'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-green-700" />
                  </div>
                  <CardTitle className="text-lg">
                    {isRTL ? benefit.titleAr : benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {isRTL ? benefit.descriptionAr : benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isRTL ? 'ما ستحصل عليه' : 'What You Get'}
          </h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-green-700" />
                </div>
                <span className="text-lg text-gray-700">
                  {isRTL ? feature.ar : feature.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {isRTL ? 'ابدأ البيع اليوم' : 'Start Selling Today'}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {isRTL
              ? 'التسجيل مجاني ويستغرق أقل من دقيقتين'
              : 'Registration is free and takes less than 2 minutes'}
          </p>
          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50 font-bold rounded-xl px-8 py-6 text-lg"
            asChild
          >
            <Link href="/register">
              {isRTL ? 'إنشاء حساب مورد' : 'Create Supplier Account'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
