'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/components/auth';
import { Send, User } from 'lucide-react';
import type { CreativePost } from '@/app/(marketing)/creative/page';

interface Comment {
  id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: CreativePost;
  onCommentAdded: () => void;
}

export function CommentsDialog({ open, onOpenChange, post, onCommentAdded }: CommentsDialogProps) {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, post.id]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/creative/${post.id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user && !guestName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/creative/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          user_name: user ? undefined : guestName,
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar' : 'en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('comments')} - {post.title}</DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('noComments')}
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{comment.user_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="border-t pt-4 space-y-3">
          {!user && (
            <Input
              placeholder={t('yourName')}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          )}
          <div className="flex gap-2">
            <Textarea
              placeholder={t('writeComment')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] resize-none"
              required
            />
            <Button
              type="submit"
              size="icon"
              className="bg-wood hover:bg-wood-dark shrink-0"
              disabled={submitting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
