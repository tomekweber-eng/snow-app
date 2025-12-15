import React, { useState } from 'react';
import { Resort, User, Memory } from '@/types';
import CountryMap from '@/components/CountryMap';
import ResortMap from '@/components/ResortMap';
import FloatingNav from '@/components/FloatingNav';
import UserProfile from '@/components/UserProfile';
import MediaViewer from '@/components/MediaViewer';
import { Mountain } from 'lucide-react';

type View = 'countries' | 'resort' | 'profile';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('countries');
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeCountry, setActiveCountry] = useState<'AT' | 'CZ'>('AT');

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
      {/* Header */}
      {currentView === 'countries' && (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mountain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg">Winter Memories</h1>
                  <p className="text-sm text-muted-foreground">Our shared adventures</p>
                </div>
              </div>

              {/* Country tabs */}
              <div className="flex gap-1 bg-muted rounded-full p-1">
                <button
                  onClick={() => setActiveCountry('AT')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCountry === 'AT' 
                      ? 'bg-white shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Austria
                </button>
                <button
                  onClick={() => setActiveCountry('CZ')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCountry === 'CZ' 
                      ? 'bg-white shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Czechia
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="relative">
        {currentView === 'countries' && (
          <div className="max-w-7xl mx-auto p-4">
            <div className="animate-fade-up">
              <CountryMap 
                country={activeCountry} 
                onResortSelect={handleResortSelect} 
              />
            </div>
          </div>
        )}

        {currentView === 'resort' && selectedResort && (
          <ResortMap 
            resort={selectedResort} 
            onBack={handleBackToCountries} 
          />
        )}

        {currentView === 'profile' && selectedUser && (
          <UserProfile 
            user={selectedUser} 
            onBack={handleBackToCountries}
            onMemorySelect={setSelectedMemory}
          />
        )}
      </main>

      {/* Floating Navigation */}
      <FloatingNav 
        onResortSelect={handleResortSelect}
        onUserSelect={handleUserSelect}
      />

      {/* Memory viewer */}
      {selectedMemory && (
        <MediaViewer 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
        />
      )}
    </div>
  );
};

export default MainApp;
