import React, { useState } from 'react';
import { Resort, User, Memory } from '@/types';
import UnifiedMap from '@/components/UnifiedMap';
import ResortMap from '@/components/ResortMap';
import UserProfile from '@/components/UserProfile';
import VideoPopup from '@/components/VideoPopup';
import BurgerMenu from '@/components/BurgerMenu';
import { Mountain } from 'lucide-react';

type View = 'countries' | 'resort' | 'profile';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('countries');
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleResortSelect = (resort: Resort) => {
    setSelectedResort(resort);
    setCurrentView('resort');
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setCurrentView('profile');
  };

  const handleBackToCountries = () => {
    setCurrentView('countries');
    setSelectedResort(null);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - shown on countries view */}
      {currentView === 'countries' && (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Burger menu for mobile */}
                <BurgerMenu
                  onResortSelect={handleResortSelect}
                  onUserSelect={handleUserSelect}
                  isAdmin={isAdmin}
                  onAdminToggle={() => setIsAdmin(!isAdmin)}
                />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mountain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="font-semibold text-lg">Winter Memories</h1>
                    <p className="text-sm text-muted-foreground">Our shared adventures</p>
                  </div>
                </div>
              </div>

              {/* Desktop title */}
              <h1 className="sm:hidden font-semibold">Winter Memories</h1>

              {/* Admin indicator */}
              {isAdmin && (
                <div className="px-3 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-xs font-medium text-primary">Admin</span>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="relative">
        {currentView === 'countries' && (
          <div className="animate-fade-up">
            <UnifiedMap onResortSelect={handleResortSelect} />
          </div>
        )}

        {currentView === 'resort' && selectedResort && (
          <ResortMap 
            resort={selectedResort} 
            onBack={handleBackToCountries}
            onResortSelect={handleResortSelect}
            onUserSelect={handleUserSelect}
            isAdmin={isAdmin}
            onAdminToggle={() => setIsAdmin(!isAdmin)}
          />
        )}

        {currentView === 'profile' && selectedUser && (
          <UserProfile 
            user={selectedUser} 
            onBack={handleBackToCountries}
            onMemorySelect={setSelectedMemory}
            onResortSelect={handleResortSelect}
            onUserSelect={handleUserSelect}
            isAdmin={isAdmin}
            onAdminToggle={() => setIsAdmin(!isAdmin)}
          />
        )}
      </main>

      {/* Memory viewer - now uses subtle popup */}
      {selectedMemory && (
        <VideoPopup 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
        />
      )}
    </div>
  );
};

export default MainApp;
