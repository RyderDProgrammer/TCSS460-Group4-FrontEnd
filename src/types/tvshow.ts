// tvshow.ts - TV Show type definitions

// API Response type (matches the actual API response)
export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date?: string;
  seasons: number;
  episodes: number;
  status: string;
  overview: string;
  popularity: string;
  tmdb_rating: string;
  vote_count: number;
  poster_url: string;
  backdrop_url: string;
  genres: string;
  networks: string;
  creators: string;
  studios: string;
  actors: string;
  // Detailed fields (from single show endpoint)
  actors_detailed?: ActorDetailed[];
  networks_detailed?: NetworkDetailed[];
  genres_detailed?: GenreDetailed[];
}

export interface ActorDetailed {
  id: number;
  name: string;
  profile_url: string;
  character_name: string;
  display_order: number;
}

export interface NetworkDetailed {
  id: number;
  name: string;
  logo_url: string | null;
  country: string;
}

export interface GenreDetailed {
  id: number;
  name: string;
}

export interface TVShowQueryParams {
  page?: number;
  limit?: number;
  name?: string;
}

// Legacy interface for backwards compatibility with mock data
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
  episodeRuntime: number[];
}
