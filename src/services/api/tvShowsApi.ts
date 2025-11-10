// TV Shows API service - NOT connected yet (Sprint requirement)
import { TVShow } from '@/types/tvShow.types';

/**
 * Fetch all TV shows
 * NOTE: Not connected to 3rd-party API yet - use mock data instead
 */
export async function fetchTVShows(): Promise<TVShow[]> {
  // TODO: Will be implemented in future sprint
  // For now, use mock data from mockTVShows.ts
  throw new Error('Not implemented - use mock data');
}

/**
 * Fetch single TV show by ID
 * NOTE: Not connected to 3rd-party API yet - use mock data instead
 */
export async function fetchTVShowById(id: string): Promise<TVShow> {
  // TODO: Will be implemented in future sprint
  // For now, use mock data from mockTVShows.ts
  throw new Error('Not implemented - use mock data');
}
