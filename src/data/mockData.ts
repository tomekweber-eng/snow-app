import { User, Resort, Memory, Comment } from '@/types';

// Import resort map images
import cernyDulMap from '@/assets/resorts/cerny-dul.jpg';
import janskeLazneMap from '@/assets/resorts/janske-lazne.webp';
import hintertuxMap from '@/assets/resorts/hintertux.jpg';
import soeldenMap from '@/assets/resorts/soelden.jpg';
import stubaiMap from '@/assets/resorts/stubai.jpg';

// Adults
export const users: User[] = [
  {
    id: 'cesel',
    name: 'Cesel',
    nickname: 'Cesel',
    avatar: '/avatars/cesel.jpg',
    bio: 'The mountain maestro. Always first on the lift.',
    sport: 'ski',
    type: 'adult',
  },
  {
    id: 'adamek',
    name: 'Adamek',
    nickname: 'Adaho',
    avatar: '/avatars/adamek.jpg',
    bio: 'Carving through life one turn at a time.',
    sport: 'ski',
    type: 'adult',
  },
  {
    id: 'tomek',
    name: 'Tomek',
    nickname: 'Tomek',
    avatar: '/avatars/tomek.jpg',
    bio: 'Powder hunter. Coffee lover.',
    sport: 'ski',
    type: 'adult',
  },
  {
    id: 'wlodek',
    name: 'Włodek',
    nickname: 'Włodek',
    avatar: '/avatars/wlodek.jpg',
    bio: 'The steady hand on steep slopes.',
    sport: 'ski',
    type: 'adult',
  },
  {
    id: 'johnny',
    name: 'Johnny',
    nickname: 'Johnny',
    avatar: '/avatars/johnny.jpg',
    bio: 'Shredding since day one.',
    sport: 'snowboard',
    type: 'adult',
  },
  {
    id: 'veba',
    name: 'Veba',
    nickname: 'Veba',
    avatar: '/avatars/veba.jpg',
    bio: 'Style over speed. Always.',
    sport: 'snowboard',
    type: 'adult',
  },
  // Kids
  {
    id: 'igi',
    name: 'Igi',
    nickname: 'Igi',
    avatar: '/avatars/igi.jpg',
    bio: 'The next generation shredder.',
    sport: 'snowboard',
    type: 'kid',
  },
  {
    id: 'olek',
    name: 'Olek',
    nickname: 'Olek',
    avatar: '/avatars/olek.jpg',
    bio: 'Small but mighty on the slopes.',
    sport: 'ski',
    type: 'kid',
  },
  {
    id: 'tadzik',
    name: 'Tadzik',
    nickname: 'Tadzik',
    avatar: '/avatars/tadzik.jpg',
    bio: 'Fearless little skier.',
    sport: 'ski',
    type: 'kid',
  },
  {
    id: 'tymon',
    name: 'Tymon',
    nickname: 'Tymon',
    avatar: '/avatars/tymon.jpg',
    bio: 'Racing down every slope.',
    sport: 'ski',
    type: 'kid',
  },
  {
    id: 'leon',
    name: 'Leon',
    nickname: 'Leon',
    avatar: '/avatars/leon.jpg',
    bio: 'Learning and loving it.',
    sport: 'ski',
    type: 'kid',
  },
  {
    id: 'max',
    name: 'Max',
    nickname: 'Max',
    avatar: '/avatars/max.jpg',
    bio: 'The youngest adventurer.',
    sport: 'ski',
    type: 'kid',
  },
];

export const resorts: Resort[] = [
  // Czech Republic
  {
    id: 'cerny-dul',
    name: 'Černý Důl',
    country: 'CZ',
    coordinates: { x: 72, y: 28 },
    mapImage: cernyDulMap,
    elevation: '660m - 1,175m',
    visited: true,
  },
  {
    id: 'janske-lazne',
    name: 'Janské Lázně',
    country: 'CZ',
    coordinates: { x: 75, y: 25 },
    mapImage: janskeLazneMap,
    elevation: '694m - 1,260m',
    visited: true,
  },
  // Austria
  {
    id: 'hintertux',
    name: 'Hintertux',
    country: 'AT',
    coordinates: { x: 55, y: 45 },
    mapImage: hintertuxMap,
    elevation: '1,500m - 3,250m',
    visited: true,
  },
  {
    id: 'soelden',
    name: 'Sölden',
    country: 'AT',
    coordinates: { x: 48, y: 52 },
    mapImage: soeldenMap,
    elevation: '1,350m - 3,340m',
    visited: true,
  },
  {
    id: 'stubai',
    name: 'Stubai Glacier',
    country: 'AT',
    coordinates: { x: 60, y: 48 },
    mapImage: stubaiMap,
    elevation: '1,695m - 3,210m',
    visited: false,
  },
];

export const memories: Memory[] = [
  // Cesel's video - linked to Sölden
  {
    id: 'mem-1',
    resortId: 'soelden',
    type: 'video',
    url: 'https://youtu.be/-xm9gzwCd0Y',
    thumbnailUrl: 'https://img.youtube.com/vi/-xm9gzwCd0Y/maxresdefault.jpg',
    date: '2024-03-05',
    description: 'Epic powder day!',
    taggedUsers: ['cesel'],
    position: { x: 45, y: 35 },
  },
  // Włodek's video - linked to Hintertux
  {
    id: 'mem-2',
    resortId: 'hintertux',
    type: 'video',
    url: 'https://youtu.be/qd8lbHVDT6U',
    thumbnailUrl: 'https://img.youtube.com/vi/qd8lbHVDT6U/maxresdefault.jpg',
    date: '2024-02-10',
    description: 'Glacier run',
    taggedUsers: ['wlodek'],
    position: { x: 50, y: 40 },
  },
  // Adamek's video - linked to Černý Důl
  {
    id: 'mem-3',
    resortId: 'cerny-dul',
    type: 'video',
    url: 'https://youtu.be/YQBk-EYtEiA',
    thumbnailUrl: 'https://img.youtube.com/vi/YQBk-EYtEiA/maxresdefault.jpg',
    date: '2024-01-20',
    description: 'Local favorite',
    taggedUsers: ['adamek'],
    position: { x: 55, y: 45 },
  },
  // Tomek's video - linked to Janské Lázně
  {
    id: 'mem-4',
    resortId: 'janske-lazne',
    type: 'video',
    url: 'https://youtu.be/F92KbwujnO4',
    thumbnailUrl: 'https://img.youtube.com/vi/F92KbwujnO4/maxresdefault.jpg',
    date: '2024-01-15',
    description: 'Morning session',
    taggedUsers: ['tomek'],
    position: { x: 40, y: 50 },
  },
  // Veba's video - linked to Sölden
  {
    id: 'mem-5',
    resortId: 'soelden',
    type: 'video',
    url: 'https://youtu.be/iJEVBIz-0Qw',
    thumbnailUrl: 'https://img.youtube.com/vi/iJEVBIz-0Qw/maxresdefault.jpg',
    date: '2024-03-06',
    description: 'Snowboard style',
    taggedUsers: ['veba'],
    position: { x: 60, y: 30 },
  },
];

export const comments: Comment[] = [
  {
    id: 'comment-1',
    content: 'What a day that was! 🎿',
    authorId: 'cesel',
    targetType: 'memory',
    targetId: 'mem-1',
    timestamp: '2024-03-05T18:00:00',
    taggedUsers: [],
  },
  {
    id: 'comment-2',
    content: 'Remember when @adamek almost crashed? 😂',
    authorId: 'wlodek',
    targetType: 'memory',
    targetId: 'mem-1',
    timestamp: '2024-03-05T19:30:00',
    taggedUsers: ['adamek'],
  },
];
