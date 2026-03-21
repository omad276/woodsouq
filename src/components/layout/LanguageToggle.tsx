'use client';

import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 font-medium"
      title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm">{language === 'en' ? 'AR' : 'EN'}</span>
    </Button>
  );
}
