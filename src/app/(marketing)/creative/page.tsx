'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/components/auth';
import { CreativeGrid } from '@/components/creative/CreativeGrid';
import { UploadDialog } from '@/components/creative/UploadDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface CreativePost {
  id: string;
  user_id: string | null;
  title: string;
  category: 'Engineering' | 'Artistic' | 'Furniture' | 'Architecture';
  description: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  creator_name: string;
  created_at: string;
}

export default function CreativePage() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState<CreativePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/creative');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    setShowUpload(false);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('creative')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('creativeSubtitle')}
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowUpload(true)}
              className="bg-wood hover:bg-wood-dark text-white"
            >
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('shareWork')}
            </Button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('noCreativePosts')}</p>
          </div>
        ) : (
          <CreativeGrid posts={posts} onUpdate={fetchPosts} />
        )}

        {/* Upload Dialog */}
        <UploadDialog
          open={showUpload}
          onOpenChange={setShowUpload}
          onSuccess={handlePostCreated}
        />
      </div>
    </div>
  );
}
