// Winter Memory Atlas Types

export type SportType = 'ski' | 'snowboard';
export type UserType = 'adult' | 'kid';

export interface User {
  id: string;
  name: string;
  nickname?: string;
  avatar: string;
  bio?: string;
  sport: SportType;
  type: UserType;
}

export interface Country {
  id: string;
  name: string;
  code: 'AT' | 'CZ';
}

export interface Resort {
  id: string;
  name: string;
  country: 'AT' | 'CZ';
  coordinates: { x: number; y: number }; // Relative position on country map (0-100)
  mapImage: string;
  elevation?: string;
  visited: boolean;
}

export interface Memory {
  id: string;
  resortId: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl?: string;
  date: string;
  description?: string;
  taggedUsers: string[];
  position?: { x: number; y: number }; // Position on resort map
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  targetType: 'memory' | 'resort';
  targetId: string;
  timestamp: string;
  taggedUsers: string[];
}
