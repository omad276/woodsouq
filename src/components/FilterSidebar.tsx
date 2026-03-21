'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WOOD_TYPES, TIMBER_CATEGORIES, PRODUCT_CATEGORIES, GRADES, COUNTRIES } from '@/types';
import { useLanguage } from '@/lib/i18n';

interface FilterSidebarProps {
  type: 'timber' | 'wood_product';
}

export function FilterSidebar({ type }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const categories = type === 'timber' ? TIMBER_CATEGORIES : PRODUCT_CATEGORIES;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset pagination
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(type === 'timber' ? '/marketplace' : '/products');
  };

  return (
    <aside className="w-full md:w-64 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-wood-dark">{t('filters')}</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {t('clearFilters')}
        </Button>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>{t('category')}</Label>
        <Select
          value={searchParams.get('category') || 'all'}
          onValueChange={(v) => updateFilter('category', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Wood Type */}
      <div className="space-y-2">
        <Label>{t('woodType')}</Label>
        <Select
          value={searchParams.get('wood_type') || 'all'}
          onValueChange={(v) => updateFilter('wood_type', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTypes')}</SelectItem>
            {WOOD_TYPES.map((wood) => (
              <SelectItem key={wood} value={wood}>
                {wood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label>{t('country')}</Label>
        <Select
          value={searchParams.get('country') || 'all'}
          onValueChange={(v) => updateFilter('country', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allCountries')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCountries')}</SelectItem>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grade */}
      <div className="space-y-2">
        <Label>{t('grade')}</Label>
        <Select
          value={searchParams.get('grade') || 'all'}
          onValueChange={(v) => updateFilter('grade', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allGrades')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allGrades')}</SelectItem>
            {GRADES.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>{t('priceRange')}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={t('minPrice')}
            className="w-full"
            defaultValue={searchParams.get('min_price') || ''}
            onBlur={(e) => updateFilter('min_price', e.target.value)}
          />
          <Input
            type="number"
            placeholder={t('maxPrice')}
            className="w-full"
            defaultValue={searchParams.get('max_price') || ''}
            onBlur={(e) => updateFilter('max_price', e.target.value)}
          />
        </div>
      </div>

      {/* Minimum Quantity */}
      <div className="space-y-2">
        <Label>{t('minimumOrder')}</Label>
        <Input
          type="number"
          placeholder={t('quantity')}
          defaultValue={searchParams.get('min_quantity') || ''}
          onBlur={(e) => updateFilter('min_quantity', e.target.value)}
        />
      </div>
    </aside>
  );
}
