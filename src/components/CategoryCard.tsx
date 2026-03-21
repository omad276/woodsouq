import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Trees, TreeDeciduous, Layers, Box, CircleDot, Slice } from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  'Hardwood': TreeDeciduous,
  'Softwood': Trees,
  'Plywood': Layers,
  'MDF': Box,
  'Logs': CircleDot,
  'Veneer': Slice,
};

interface CategoryCardProps {
  name: string;
  iconKey?: string;
  href: string;
}

export function CategoryCard({ name, iconKey, href }: CategoryCardProps) {
  const Icon = categoryIcons[iconKey || name] || Trees;

  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-lg hover:border-wood transition-all cursor-pointer">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-wood/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-wood" />
          </div>
          <h3 className="font-semibold text-foreground">{name}</h3>
        </div>
      </Card>
    </Link>
  );
}
