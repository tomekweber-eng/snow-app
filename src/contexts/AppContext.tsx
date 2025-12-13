import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Location, Route, MediaItem, User } from '@/types';
import { locations, routes, mediaItems, users } from '@/data/mockData';

interface AppContextType {
  locations: Location[];
  routes: Route[];
  mediaItems: MediaItem[];
  users: User[];
  selectedLocation: Location | null;
  selectedRoute: Route | null;
  selectedMedia: MediaItem | null;
  setSelectedLocation: (location: Location | null) => void;
  setSelectedRoute: (route: Route | null) => void;
  setSelectedMedia: (media: MediaItem | null) => void;
  getRoutesByLocation: (locationId: string) => Route[];
  getMediaByRoute: (routeId: string) => MediaItem[];
  getMediaByLocation: (locationId: string) => MediaItem[];
  getUserById: (userId: string) => User | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const getRoutesByLocation = (locationId: string) => {
    return routes.filter(route => route.locationId === locationId);
  };

  const getMediaByRoute = (routeId: string) => {
    return mediaItems.filter(media => media.routeId === routeId);
  };

  const getMediaByLocation = (locationId: string) => {
    return mediaItems.filter(media => media.locationId === locationId);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  return (
    <AppContext.Provider
      value={{
        locations,
        routes,
        mediaItems,
        users,
        selectedLocation,
        selectedRoute,
        selectedMedia,
        setSelectedLocation,
        setSelectedRoute,
        setSelectedMedia,
        getRoutesByLocation,
        getMediaByRoute,
        getMediaByLocation,
        getUserById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
