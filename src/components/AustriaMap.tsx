import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Location } from '@/types';
import { MapPin, Calendar, Mountain, ChevronRight } from 'lucide-react';

interface AustriaMapProps {
  onLocationSelect: (location: Location) => void;
}

export function AustriaMap({ onLocationSelect }: AustriaMapProps) {
  const { locations, getRoutesByLocation, getMediaByLocation } = useApp();

  // Simplified Austria map bounds for positioning
  const mapBounds = {
    minLat: 46.3,
    maxLat: 49.0,
    minLng: 9.5,
    maxLng: 17.2,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[600px]">
      {/* Map Background with Austria silhouette */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-mountain/50 via-card to-pine/30" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Austria outline SVG */}
        <svg
          viewBox="0 0 100 50"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M10,25 Q15,20 25,22 L35,18 Q45,15 55,18 L65,22 Q75,25 85,20 L90,25 Q88,30 80,32 L70,35 Q60,38 50,35 L40,32 Q30,30 20,33 L15,30 Q12,28 10,25 Z"
            fill="hsl(var(--secondary))"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            className="opacity-50"
          />
        </svg>

        {/* Mountain silhouettes */}
        <svg
          viewBox="0 0 100 20"
          className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 L5,12 L10,15 L18,5 L25,14 L32,8 L40,16 L48,4 L55,12 L62,6 L70,14 L78,3 L85,11 L92,7 L100,15 L100,20 Z"
            fill="hsl(var(--muted))"
          />
        </svg>
      </div>

      {/* Location Markers */}
      {locations.map((location, index) => {
        const pos = getPosition(location.coordinates.lat, location.coordinates.lng);
        const routeCount = getRoutesByLocation(location.id).length;
        const mediaCount = getMediaByLocation(location.id).length;

        return (
          <button
            key={location.id}
            onClick={() => onLocationSelect(location)}
            className="absolute group transition-all duration-500 hover:z-20"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {/* Pulse ring */}
            <div className="absolute inset-0 w-12 h-12 -m-3 rounded-full bg-primary/30 animate-ping opacity-0 group-hover:opacity-100" />
            
            {/* Marker */}
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-primary to-firelight shadow-glow transition-all duration-300 group-hover:scale-150 group-hover:shadow-elevated">
              <MapPin className="w-3 h-3 text-primary-foreground" />
            </div>

            {/* Info card on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="glass-warm rounded-xl p-4 min-w-[200px] shadow-elevated text-left">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {location.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{location.region}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-primary" />
                    {routeCount} routes
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    {location.tripDates.length} trips
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-primary mt-3">
                  <span>View memories</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-firelight" />
          <span>{locations.length} ski destinations</span>
        </div>
      </div>
    </div>
  );
}
