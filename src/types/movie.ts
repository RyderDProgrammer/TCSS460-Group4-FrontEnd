// movie.ts - Movie type definitions

export interface IMovie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  runtime: number; // in minutes
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
