import { tvService } from 'utils/axios';
import { TVShow, TVShowQueryParams } from 'types/tvshow';

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
  getTVShowById: (id: number) => tvService.get<TVShow>(`/api/shows/${id}`)
};
