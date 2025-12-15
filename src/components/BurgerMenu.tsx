import React, { useState } from 'react';
import { Menu, X, MapPin, Users, Shield, Mountain } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Resort, User } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface BurgerMenuProps {
  onResortSelect: (resort: Resort) => void;
  onUserSelect: (user: User) => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
}

type MenuTab = 'places' | 'people';

const BurgerMenu: React.FC<BurgerMenuProps> = ({ 
  onResortSelect, 
  onUserSelect, 
  isAdmin, 
  onAdminToggle 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MenuTab>('places');
  const { resorts, getAdults, getKids, getMemoriesByUser } = useApp();

  const adults = getAdults();
  const kids = getKids();
  const austriaResorts = resorts.filter(r => r.country === 'AT');
  const czechResorts = resorts.filter(r => r.country === 'CZ');

  const handleResortClick = (resort: Resort) => {
    onResortSelect(resort);
    setIsOpen(false);
  };

  const handleUserClick = (user: User) => {
    onUserSelect(user);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-primary" />
            </div>
            <span>Winter Memories</span>
          </SheetTitle>
        </SheetHeader>

        {/* Tab switcher */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-1 bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab('places')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'places' 
                  ? 'bg-white shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Places
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'people' 
                  ? 'bg-white shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              People
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {activeTab === 'places' ? (
            <div className="p-4 space-y-6">
              {/* Austria */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Austria
                </h4>
                <div className="space-y-1">
                  {austriaResorts.map((resort) => (
                    <button
                      key={resort.id}
                      onClick={() => handleResortClick(resort)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <div className={`w-3 h-3 rounded-full ${resort.visited ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      <div>
                        <p className="font-medium">{resort.name}</p>
                        <p className="text-xs text-muted-foreground">{resort.elevation}</p>
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
                <div className="space-y-1">
                  {czechResorts.map((resort) => (
                    <button
                      key={resort.id}
                      onClick={() => handleResortClick(resort)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <div className={`w-3 h-3 rounded-full ${resort.visited ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      <div>
                        <p className="font-medium">{resort.name}</p>
                        <p className="text-xs text-muted-foreground">{resort.elevation}</p>
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
                <div className="space-y-1">
                  {adults.map((user) => {
                    const userMemories = getMemoriesByUser(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center text-base font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            <span className="text-sm">{user.sport === 'ski' ? '🎿' : '🏂'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
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
                <div className="space-y-1">
                  {kids.map((user) => {
                    const userMemories = getMemoriesByUser(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center text-base font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            <span className="text-sm">{user.sport === 'ski' ? '🎿' : '🏂'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
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

        {/* Admin toggle */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <button
            onClick={onAdminToggle}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
              isAdmin 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="font-medium">{isAdmin ? 'Admin Mode On' : 'Admin Mode'}</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BurgerMenu;
