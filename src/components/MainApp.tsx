import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AustriaMap } from '@/components/AustriaMap';
import { LocationDetail } from '@/components/LocationDetail';
import { RouteDetail } from '@/components/RouteDetail';
import { Location, Route } from '@/types';
import { Snowflake } from 'lucide-react';

type View = 'map' | 'location' | 'route';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('map');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setCurrentView('location');
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setCurrentView('route');
  };

  const handleBackToMap = () => {
    setCurrentView('map');
    setSelectedLocation(null);
    setSelectedRoute(null);
  };

  const handleBackToLocation = () => {
    setCurrentView('location');
    setSelectedRoute(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-mountain/10 rounded-full blur-[100px]" />
        
        {/* Floating snowflakes */}
        {[...Array(8)].map((_, i) => (
          <Snowflake
            key={i}
            className="absolute text-snow/10 animate-snow-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              fontSize: `${12 + Math.random() * 12}px`,
            }}
          />
        ))}
      </div>

      <Header 
        onNavigateHome={handleBackToMap} 
        showBackHome={currentView !== 'map'} 
      />

      <main className="container mx-auto px-4 py-6 relative z-10">
        {currentView === 'map' && (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
                Our Mountain Adventures
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Tap a location to explore shared memories from our ski trips across Austria
              </p>
            </div>
            <AustriaMap onLocationSelect={handleLocationSelect} />
          </div>
        )}

        {currentView === 'location' && selectedLocation && (
          <LocationDetail
            location={selectedLocation}
            onBack={handleBackToMap}
            onRouteSelect={handleRouteSelect}
          />
        )}

        {currentView === 'route' && selectedRoute && (
          <RouteDetail
            route={selectedRoute}
            onBack={handleBackToLocation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground/60">
        <p>A private winter journal for friends 🏔️</p>
      </footer>
    </div>
  );
}
