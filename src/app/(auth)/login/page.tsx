'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/auth';
import { useLanguage } from '@/lib/i18n';
import { Loader2 } from 'lucide-react';

function LoginLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-wood" />
      <span className="ml-2 text-muted-foreground">{t('loading')}</span>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
