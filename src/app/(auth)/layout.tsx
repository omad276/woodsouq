import Link from 'next/link';
import { WoodSouqLogo } from '@/components/ui/woodsouq-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="mb-8">
        <WoodSouqLogo size="lg" />
      </Link>
      {children}
    </div>
  );
}
