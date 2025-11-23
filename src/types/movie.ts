// movie.ts - Movie type definitions

// API Response type (matches the actual API response)
export interface Movie {
  movie_id: number;
  title: string;
  original_title: string;
  directors: string;
  genres: string;
  release_date: string;
  runtime_minutes: number;
  overview: string;
  budget: string;
  revenue: string;
  mpa_rating: string;
  poster_url: string;
  backdrop_url: string;
}

export interface MoviesResponse {
  movies: Movie[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MovieQueryParams {
  page?: number;
  limit?: number;
  title?: string;
  year?: number;
  genre?: string;
  rating?: string;
  actor?: string;
  director?: string;
  studio?: string;
  collection?: string;
  minBudget?: number;
  maxBudget?: number;
  minRevenue?: number;
  maxRevenue?: number;
  startDate?: string;
  endDate?: string;
}

// Legacy interface for backwards compatibility with mock data
export interface IMovie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  runtime: number;
  genre: string[];
  director: string;
  cast: string[];
  posterUrl: string;
  backdropUrl?: string;
  language: string;
  budget?: number;
  revenue?: number;
  tagline?: string;
}
