// Movies API service - NOT connected yet (Sprint requirement)
import { Movie } from '@/types/movie.types';

/**
 * Fetch all movies
 * NOTE: Not connected to 3rd-party API yet - use mock data instead
 */
export async function fetchMovies(): Promise<Movie[]> {
  // TODO: Will be implemented in future sprint
  // For now, use mock data from mockMovies.ts
  throw new Error('Not implemented - use mock data');
}

/**
 * Fetch single movie by ID
 * NOTE: Not connected to 3rd-party API yet - use mock data instead
 */
export async function fetchMovieById(id: string): Promise<Movie> {
  // TODO: Will be implemented in future sprint
  // For now, use mock data from mockMovies.ts
  throw new Error('Not implemented - use mock data');
}
