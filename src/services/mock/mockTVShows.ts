// Mock TV show data for development
import { TVShow } from '@/types/tvShow.types';

export const mockTVShows: TVShow[] = [
  {
    id: '1',
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.',
    firstAirDate: '2008-01-20',
    lastAirDate: '2013-09-29',
    rating: 9.5,
    genre: ['Crime', 'Drama', 'Thriller'],
    creator: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    posterUrl: '/images/tv-shows/breaking-bad.jpg',
    backdropUrl: '/images/tv-shows/breaking-bad-backdrop.jpg',
    numberOfSeasons: 5,
    numberOfEpisodes: 62,
    episodeRunTime: [45, 47],
    status: 'Ended',
    network: 'AMC',
    language: 'English',
  },
  {
    id: '2',
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.',
    firstAirDate: '2011-04-17',
    lastAirDate: '2019-05-19',
    rating: 9.3,
    genre: ['Action', 'Adventure', 'Drama'],
    creator: 'David Benioff, D.B. Weiss',
    cast: ['Emilia Clarke', 'Peter Dinklage', 'Kit Harington'],
    posterUrl: '/images/tv-shows/game-of-thrones.jpg',
    backdropUrl: '/images/tv-shows/game-of-thrones-backdrop.jpg',
    numberOfSeasons: 8,
    numberOfEpisodes: 73,
    episodeRunTime: [50, 60, 80],
    status: 'Ended',
    network: 'HBO',
    language: 'English',
  },
];

/**
 * Get all TV shows (mock data)
 */
export function getMockTVShows(): TVShow[] {
  return mockTVShows;
}

/**
 * Get single TV show by ID (mock data)
 */
export function getMockTVShowById(id: string): TVShow | undefined {
  return mockTVShows.find(show => show.id === id);
}
