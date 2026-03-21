import { Suspense } from 'react';
import { LoginForm } from '@/components/auth';

export const metadata = {
  title: 'Login - TimberLink',
  description: 'Sign in to your TimberLink account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
