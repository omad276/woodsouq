'use client';

import { useLanguage } from '@/lib/i18n';
import { CategoryCard } from '@/components/CategoryCard';

export function CategoriesSection() {
  const { t } = useLanguage();

  const categories = [
    { name: t('hardwood'), iconKey: 'Hardwood', href: '/marketplace?category=Hardwood' },
    { name: t('softwood'), iconKey: 'Softwood', href: '/marketplace?category=Softwood' },
    { name: t('plywood'), iconKey: 'Plywood', href: '/marketplace?category=Plywood' },
    { name: t('mdf'), iconKey: 'MDF', href: '/marketplace?category=MDF' },
    { name: t('logs'), iconKey: 'Logs', href: '/marketplace?category=Logs' },
    { name: t('veneer'), iconKey: 'Veneer', href: '/marketplace?category=Veneer' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-wood-dark text-center mb-10">
          {t('browseByCategory')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.iconKey} name={category.name} iconKey={category.iconKey} href={category.href} />
          ))}
        </div>
      </div>
    </section>
  );
}
