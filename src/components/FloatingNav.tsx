import React, { useState } from 'react';
import { MapPin, Users, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Resort, User } from '@/types';

interface FloatingNavProps {
  onResortSelect: (resort: Resort) => void;
  onUserSelect: (user: User) => void;
}

type NavTab = 'places' | 'people';

const FloatingNav: React.FC<FloatingNavProps> = ({ onResortSelect, onUserSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('places');
  const { resorts, getAdults, getKids, getMemoriesByUser } = useApp();

  const adults = getAdults();
  const kids = getKids();

  const austriaResorts = resorts.filter(r => r.country === 'AT');
  const czechResorts = resorts.filter(r => r.country === 'CZ');

  return (
    <>
      {/* Toggle buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        <button
          onClick={() => { setIsOpen(true); setActiveTab('places'); }}
          className={`
            floating-nav px-5 py-3 flex items-center gap-2
            transition-all duration-300
            ${isOpen && activeTab === 'places' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
          `}
        >
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Places</span>
        </button>
        
        <button
          onClick={() => { setIsOpen(true); setActiveTab('people'); }}
          className={`
            floating-nav px-5 py-3 flex items-center gap-2
            transition-all duration-300
            ${isOpen && activeTab === 'people' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
          `}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">People</span>
        </button>
      </div>

      {/* Panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-24 md:w-80 bg-white rounded-t-3xl md:rounded-3xl shadow-xl max-h-[70vh] overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-lg">
                {activeTab === 'places' ? 'Places' : 'People'}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
              {activeTab === 'places' ? (
                <div className="p-4 space-y-6">
                  {/* Austria */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Austria
                    </h4>
                    <div className="space-y-2">
                      {austriaResorts.map((resort) => (
                        <button
                          key={resort.id}
                          onClick={() => { onResortSelect(resort); setIsOpen(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <div className={`w-3 h-3 rounded-full ${resort.visited ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          <div>
                            <p className="font-medium">{resort.name}</p>
                            <p className="text-sm text-muted-foreground">{resort.elevation}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Czech Republic */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Czech Republic
                    </h4>
                    <div className="space-y-2">
                      {czechResorts.map((resort) => (
                        <button
                          key={resort.id}
                          onClick={() => { onResortSelect(resort); setIsOpen(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <div className={`w-3 h-3 rounded-full ${resort.visited ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          <div>
                            <p className="font-medium">{resort.name}</p>
                            <p className="text-sm text-muted-foreground">{resort.elevation}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Adults */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Adults
                    </h4>
                    <div className="space-y-2">
                      {adults.map((user) => {
                        const userMemories = getMemoriesByUser(user.id);
                        return (
                          <button
                            key={user.id}
                            onClick={() => { onUserSelect(user); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center text-lg font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.name}</p>
                                <span className="text-sm">{user.sport === 'ski' ? '🎿' : '🏂'}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {userMemories.length} memories
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kids */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Kids
                    </h4>
                    <div className="space-y-2">
                      {kids.map((user) => {
                        const userMemories = getMemoriesByUser(user.id);
                        return (
                          <button
                            key={user.id}
                            onClick={() => { onUserSelect(user); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center text-lg font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.name}</p>
                                <span className="text-sm">{user.sport === 'ski' ? '🎿' : '🏂'}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {userMemories.length} memories
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNav;
