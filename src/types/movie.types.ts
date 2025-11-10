// Movie type definitions

export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  genre: string[];
  director: string;
  cast: string[];
  posterUrl: string;
  backdropUrl?: string;
  duration: number; // in minutes
  language: string;
  budget?: number;
  revenue?: number;
  tagline?: string;
}

export interface MovieListItem {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  releaseDate: string;
}
