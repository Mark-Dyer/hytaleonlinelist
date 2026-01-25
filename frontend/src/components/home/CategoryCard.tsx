'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/components/analytics';
import type { Category } from '@/types';
import {
  Gamepad2,
  Shield,
  Swords,
  Brush,
  Scroll,
  Map,
  Puzzle,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  survival: Shield,
  pvp: Swords,
  creative: Brush,
  rpg: Scroll,
  minigames: Gamepad2,
  adventure: Map,
  modded: Puzzle,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug] || Gamepad2;

  const handleClick = () => {
    trackEvent('category_clicked', {
      category_slug: category.slug,
      category_name: category.name,
    });
  };

  return (
    <Link href={`/servers/${category.slug}`} onClick={handleClick}>
      <Card className="group h-full cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50">
        <CardContent className="flex flex-col items-center p-4 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{category.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {category.serverCount} servers
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
