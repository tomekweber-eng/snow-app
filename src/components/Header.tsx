import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FriendsPanel } from '@/components/FriendsPanel';
import { Mountain, LogOut, Users, Home } from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  showBackHome?: boolean;
}

export function Header({ onNavigateHome, showBackHome }: HeaderProps) {
  const { logout } = useAuth();
  const [showFriends, setShowFriends] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-firelight/10 border border-primary/30 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-semibold text-foreground">Winter Memories</h1>
              <p className="text-xs text-muted-foreground">Our mountain adventures</p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {showBackHome && (
              <Button variant="ghost" size="sm" onClick={onNavigateHome} className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowFriends(true)}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Friends</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={logout} title="Leave cabin">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <FriendsPanel isOpen={showFriends} onClose={() => setShowFriends(false)} />
    </>
  );
}
