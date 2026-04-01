'use client';

import { CreativeCard } from './CreativeCard';
import type { CreativePost } from '@/app/(marketing)/creative/page';

interface CreativeGridProps {
  posts: CreativePost[];
  onUpdate: () => void;
}

export function CreativeGrid({ posts, onUpdate }: CreativeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <CreativeCard key={post.id} post={post} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
