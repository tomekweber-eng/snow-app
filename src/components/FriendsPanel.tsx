import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Mountain, Image as ImageIcon } from 'lucide-react';

interface FriendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendsPanel({ isOpen, onClose }: FriendsPanelProps) {
  const { users, mediaItems, routes } = useApp();

  if (!isOpen) return null;

  const getUserStats = (userId: string) => {
    const userRoutes = routes.filter(r => r.participants.includes(userId));
    const userMedia = mediaItems.filter(m => m.uploadedBy === userId || m.taggedUsers.includes(userId));
    return { routeCount: userRoutes.length, mediaCount: userMedia.length };
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-card border-l border-border shadow-elevated animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl font-semibold text-foreground">Our Crew</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {users.map((user) => {
            const stats = getUserStats(user.id);
            
            return (
              <Card key={user.id} variant="glass" className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-firelight/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{user.name}</h3>
                      <span className="text-lg">
                        {user.type === 'skier' ? '⛷️' : '🏂'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{user.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mountain className="w-4 h-4 text-primary" />
                    <span>{stats.routeCount} rides</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span>{stats.mediaCount} memories</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
