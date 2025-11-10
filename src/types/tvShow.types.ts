// TV show type definitions

export interface TVShow {
  id: string;
  title: string;
  description: string;
  firstAirDate: string;
  lastAirDate?: string;
  rating: number;
  genre: string[];
  creator: string;
  cast: string[];
  posterUrl: string;
  backdropUrl?: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime: number[]; // in minutes
  status: 'Returning Series' | 'Ended' | 'Canceled' | 'In Production';
  network: string;
  language: string;
}

export interface TVShowListItem {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  firstAirDate: string;
  status: string;
}
