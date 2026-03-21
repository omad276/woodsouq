import Link from 'next/link';
import { TreePine } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <TreePine className="h-10 w-10 text-wood" />
        <span className="text-2xl font-bold text-wood-dark">TimberLink</span>
      </Link>
      {children}
    </div>
  );
}
