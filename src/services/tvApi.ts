import { tvService } from 'utils/axios';
import { TVShow, TVShowQueryParams } from 'types/tvshow';

export interface CreateTVShowPayload {
  name: string;
  original_name?: string;
  first_air_date: string;
  last_air_date?: string;
  seasons?: number;
  episodes?: number;
  status?: string;
  overview?: string;
  popularity?: number;
  tmdb_rating?: number;
  vote_count?: number;
  poster_url?: string;
  backdrop_url?: string;
  genres?: string;
  networks?: string;
  creators?: string;
  studios?: string;
  actors?: string;
}

export const tvApi = {
  // Get all TV shows with optional filtering
  getTVShows: (params?: TVShowQueryParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.name) queryParams.append('name', params.name);

    const queryString = queryParams.toString();
    return tvService.get<TVShow[]>(`/api/shows${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single TV show by ID
  getTVShowById: (id: number) => tvService.get<TVShow>(`/api/shows/${id}`),

  // Create a new TV show
  createTVShow: (data: CreateTVShowPayload) => tvService.post<TVShow>('/api/shows', data),

  // Delete a TV show by ID
  deleteTVShow: (id: number) => tvService.delete(`/api/shows/${id}`)
};
