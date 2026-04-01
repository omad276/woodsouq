'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/components/auth';
import { CommentsDialog } from './CommentsDialog';
import type { CreativePost } from '@/app/(marketing)/creative/page';

interface CreativeCardProps {
  post: CreativePost;
  onUpdate: () => void;
}

const categoryColors: Record<string, string> = {
  Engineering: 'bg-blue-500',
  Artistic: 'bg-purple-500',
  Furniture: 'bg-amber-600',
  Architecture: 'bg-green-600',
};

export function CreativeCard({ post, onUpdate }: CreativeCardProps) {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`/api/creative/${post.id}/like`)
        .then(res => res.json())
        .then(data => setLiked(data.hasLiked))
        .catch(() => {});
    }
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user) return;
    if (likeLoading) return;

    setLikeLoading(true);
    try {
      const res = await fetch(`/api/creative/${post.id}/like`, {
        method: 'POST',
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const key = `category${category}` as keyof typeof import('@/lib/i18n/translations').translations.en;
    return t(key);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-muted">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <Badge
            className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} ${categoryColors[post.category]} text-white`}
          >
            {getCategoryLabel(post.category)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {post.title}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <User className="h-3 w-3" />
            {post.creator_name}
          </div>
          {post.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {post.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLike}
              disabled={!user || likeLoading}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentsDialog
        open={showComments}
        onOpenChange={setShowComments}
        post={post}
        onCommentAdded={onUpdate}
      />
    </>
  );
}
