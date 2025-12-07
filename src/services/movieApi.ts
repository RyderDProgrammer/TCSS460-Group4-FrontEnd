import { movieService } from 'utils/axios';
import { Movie, MovieQueryParams } from 'types/movie';

export interface CreateMoviePayload {
  title: string;
  original_title?: string;
  release_date: string;
  runtime_minutes: number;
  overview?: string;
  budget?: number;
  revenue?: number;
  mpa_rating?: string;
  collection_name?: string;
  poster_url?: string;
  backdrop_url?: string;
  genres?: string[];
  directors?: string[];
  producers?: string[];
  studios?: Array<{
    studio_name: string;
    logo_url?: string;
    country?: string;
  }>;
  cast?: Array<{
    actor_name: string;
    character_name?: string;
    actor_order?: number;
    profile_url?: string;
  }>;
}

export const movieApi = {
  // Get all movies with optional filtering
  getMovies: (params?: MovieQueryParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.title) queryParams.append('title', params.title);
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.genre) queryParams.append('genre', params.genre);
    if (params?.rating) queryParams.append('rating', params.rating);
    if (params?.actor) queryParams.append('actor', params.actor);
    if (params?.director) queryParams.append('director', params.director);
    if (params?.studio) queryParams.append('studio', params.studio);
    if (params?.collection) queryParams.append('collection', params.collection);
    if (params?.minBudget) queryParams.append('minBudget', params.minBudget.toString());
    if (params?.maxBudget) queryParams.append('maxBudget', params.maxBudget.toString());
    if (params?.minRevenue) queryParams.append('minRevenue', params.minRevenue.toString());
    if (params?.maxRevenue) queryParams.append('maxRevenue', params.maxRevenue.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    return movieService.get<Movie[]>(`/api/movies${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single movie by ID
  getMovieById: (id: number) => movieService.get<Movie>(`/api/movies/${id}`),

  // Get movies by studio ID
  getMoviesByStudioId: (studioId: number) => movieService.get<Movie[]>(`/api/studios/${studioId}/movies`),

  // Get movies by studio name
  getMoviesByStudioName: (studioName: string) => movieService.get<Movie[]>(`/api/studios/name/${studioName}/movies`),

  // Get movies by director ID
  getMoviesByDirectorId: (directorId: number) => movieService.get<Movie[]>(`/api/directors/${directorId}/movies`),

  // Get movies by director name
  getMoviesByDirectorName: (directorName: string) => movieService.get<Movie[]>(`/api/directors/name/${directorName}/movies`),

  // Get movies by actor ID
  getMoviesByActorId: (actorId: number) => movieService.get<Movie[]>(`/api/actors/${actorId}/movies`),

  // Get movies by actor name
  getMoviesByActorName: (actorName: string) => movieService.get<Movie[]>(`/api/actors/name/${actorName}/movies`),

  // Get movies by collection ID
  getMoviesByCollectionId: (collectionId: number) => movieService.get<Movie[]>(`/api/collections/${collectionId}/movies`),

  // Get movies by collection name
  getMoviesByCollectionName: (collectionName: string) => movieService.get<Movie[]>(`/api/collections/name/${collectionName}/movies`),

  // Create a new movie
  createMovie: (data: CreateMoviePayload) => movieService.post<Movie>('/api/movies', data),

  // Delete a movie by ID
  deleteMovie: (id: number) => movieService.delete(`/api/movies/${id}`)
};
