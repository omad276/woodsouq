'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n';
import { Upload, Loader2 } from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const categories = ['Engineering', 'Artistic', 'Furniture', 'Architecture'] as const;

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !imageUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          image_url: imageUrl,
        }),
      });

      if (res.ok) {
        setTitle('');
        setCategory('');
        setDescription('');
        setImageUrl('');
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    const key = `category${cat}` as keyof typeof import('@/lib/i18n/translations').translations.en;
    return t(key);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shareWork')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creative-title">{t('title')}</Label>
            <Input
              id="creative-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('creativeTitlePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creative-category">{t('category')}</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="creative-category">
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creative-description">{t('description')}</Label>
            <Textarea
              id="creative-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('creativeDescPlaceholder')}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('image')}</Label>
            {imageUrl ? (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => setImageUrl('')}
                >
                  {t('change')}
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {t('uploadImage')}
                    </span>
                  </>
                )}
              </label>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-wood hover:bg-wood-dark"
            disabled={submitting || !title || !category || !imageUrl}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('publish')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
