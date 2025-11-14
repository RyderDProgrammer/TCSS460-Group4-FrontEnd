// tvshow.ts - TV Show type definitions

export interface ITVShow {
  id: string;
  name: string;
  description: string;
  firstAirDate: string;
  lastAirDate?: string;
  rating: number;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  genre: string[];
  creators: string[];
  cast: string[];
  posterUrl: string;
  backdropUrl?: string;
  language: string;
  status: 'Returning Series' | 'Ended' | 'Canceled' | 'In Production';
  network: string;
  episodeRuntime: number[]; // in minutes
}
