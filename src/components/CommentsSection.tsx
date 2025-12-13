import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Comment } from '@/types';
import { comments as mockComments } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';

interface CommentsSectionProps {
  targetType: 'route' | 'photo' | 'video';
  targetId: string;
}

export function CommentsSection({ targetType, targetId }: CommentsSectionProps) {
  const { getUserById } = useApp();
  const [newComment, setNewComment] = useState('');
  
  const filteredComments = mockComments.filter(
    c => c.targetType === targetType && c.targetId === targetId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // In a real app, this would send to the backend
    setNewComment('');
  };

  const renderCommentContent = (content: string) => {
    // Highlight @mentions
    return content.split(/(@\w+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-primary font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card variant="glass" className="mt-6 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 text-foreground">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Banter & Memories</h3>
          <span className="text-sm text-muted-foreground">
            ({filteredComments.length})
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => {
            const author = getUserById(comment.authorId);
            
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-secondary-foreground">
                    {author?.name.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {author?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-foreground">
                    {renderCommentContent(comment.content)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Be the first to share a memory!
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment or tag a friend with @..."
            className="flex-1"
          />
          <Button type="submit" variant="warm" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
