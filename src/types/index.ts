// Winter Memory Journal Types

export interface User {
  id: string;
  name: string;
  avatar?: string;
  type: 'skier' | 'snowboarder';
}

export interface Location {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  elevation?: string;
  imageUrl?: string;
  tripDates: string[];
}

export interface Route {
  id: string;
  locationId: string;
  name: string;
  date: string;
  participants: string[];
  difficulty?: 'easy' | 'intermediate' | 'advanced' | 'expert';
  isPlanned?: boolean;
  path?: { lat: number; lng: number }[];
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl?: string;
  timestamp: string;
  locationId: string;
  routeId?: string;
  uploadedBy: string;
  taggedUsers: string[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  targetType: 'route' | 'photo' | 'video';
  targetId: string;
  timestamp: string;
  taggedUsers: string[];
}

export interface Trip {
  id: string;
  locationId: string;
  startDate: string;
  endDate: string;
  participants: string[];
}
