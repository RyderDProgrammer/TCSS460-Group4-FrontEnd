'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination
} from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import SearchIcon from '@ant-design/icons/SearchOutlined';
import { movieApi } from 'services/movieApi';
import { Movie } from 'types/movie';
import { useRouter, useSearchParams } from 'next/navigation';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MoviesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const searchFromUrl = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = useCallback(async (searchTitle?: string, pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await movieApi.getMovies({
        page: pageNum,
        limit: 10,
        title: searchTitle || undefined
      });
      // Normalize different response shapes (array | { data: [...] } | { movies: [...] } | { results: [...] })
      const res: any = response;
      let payload: Movie[] = [];
      let pages = 1;

      if (Array.isArray(res)) {
        payload = res as Movie[];
      } else if (Array.isArray(res?.data)) {
        payload = res.data as Movie[];
      } else if (Array.isArray(res?.data?.data)) {
        payload = res.data.data as Movie[];
      } else if (Array.isArray(res?.movies)) {
        payload = res.movies as Movie[];
      } else if (Array.isArray(res?.data?.movies)) {
        payload = res.data.movies as Movie[];
      } else if (Array.isArray(res?.results)) {
        payload = res.results as Movie[];
      }

      // Pagination meta (try multiple common fields)
      pages = res?.data?.meta?.pages || res?.data?.pagination?.totalPages || res?.pagination?.totalPages || res?.totalPages || res?.data?.totalPages || 1;

      if (Array.isArray(payload) && payload.length > 0) {
        // If API returned full dataset (no server pagination), apply client-side filtering + pagination when a title is provided
        if (Array.isArray(payload) && payload.length > 0 && (res?.data == null || !res?.data?.meta)) {
          let filteredData = payload;
          if (searchTitle) {
            filteredData = payload.filter((movie: Movie) =>
              movie.title.toLowerCase().includes(searchTitle.toLowerCase())
            );
          }
          const startIndex = (pageNum - 1) * 10;
          const paginatedMovies = filteredData.slice(startIndex, startIndex + 10);
          setMovies(paginatedMovies);
          setTotalPages(Math.max(Math.ceil(filteredData.length / 10), 1));
        } else {
          setMovies(payload);
          setTotalPages(pages || 1);
        }
      } else {
        setMovies([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      const msg = err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
      setError(msg || 'Failed to fetch movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when page or search from URL changes
  useEffect(() => {
    setPage(pageFromUrl);
    setSearchQuery(searchFromUrl);
    fetchMovies(searchFromUrl, pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFromUrl, searchFromUrl]);

  // Debounced search - only run when search query actually changes
  useEffect(() => {
    if (searchQuery === '') return; // Don't run on empty search
    if (searchQuery === searchFromUrl) return; // Don't run if search matches URL (already loaded)

    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchMovies(searchQuery, 1);
      // Update URL to page 1 when searching
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('search', searchQuery);
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchMovies(searchQuery, value);
    // Update URL with new page number (use replace to avoid adding to history)
    const params = new URLSearchParams();
    params.set('page', value.toString());
    if (searchQuery) params.set('search', searchQuery);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const getImageUrl = (posterPath: string) => {
    if (!posterPath) return '/placeholder-movie.png';
    if (posterPath.startsWith('http')) return posterPath;
    return `${TMDB_IMAGE_BASE}${posterPath}`;
  };

  const getFirstGenre = (genres: string) => {
    if (!genres) return 'Unknown';
    return genres.split(',')[0].trim();
  };

  return (
    <MainCard title="Movies">
      <Stack spacing={3}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search movies by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
          size="small"
        />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <>
            <Grid container spacing={2}>
              {movies.map((movie) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.movie_id}>
                  <Link href={`/movies/${movie.movie_id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, boxShadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(movie.poster_url)}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {movie.title}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                          <Chip label={movie.mpa_rating || 'NR'} size="small" variant="outlined" />
                          <Chip label={getFirstGenre(movie.genres)} size="small" variant="outlined" />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
              </Box>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary">
              {searchQuery ? `No movies found for "${searchQuery}"` : 'No movies available.'}
            </Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}
