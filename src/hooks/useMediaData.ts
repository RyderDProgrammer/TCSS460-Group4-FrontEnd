// Media data fetching hook
'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie.types';
import { TVShow } from '@/types/tvShow.types';
import { getMockMovies, getMockMovieById } from '@/services/mock/mockMovies';
import { getMockTVShows, getMockTVShowById } from '@/services/mock/mockTVShows';

/**
 * Hook to fetch movies list (uses mock data)
 */
export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using mock data as per sprint requirements
        const data = getMockMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { movies, loading, error };
}

/**
 * Hook to fetch single movie (uses mock data)
 */
export function useMovie(id: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using mock data as per sprint requirements
        const data = getMockMovieById(id);
        setMovie(data || null);
      } catch (err) {
        setError('Failed to fetch movie');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { movie, loading, error };
}

/**
 * Hook to fetch TV shows list (uses mock data)
 */
export function useTVShows() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using mock data as per sprint requirements
        const data = getMockTVShows();
        setTVShows(data);
      } catch (err) {
        setError('Failed to fetch TV shows');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tvShows, loading, error };
}

/**
 * Hook to fetch single TV show (uses mock data)
 */
export function useTVShow(id: string) {
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using mock data as per sprint requirements
        const data = getMockTVShowById(id);
        setTVShow(data || null);
      } catch (err) {
        setError('Failed to fetch TV show');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { tvShow, loading, error };
}
