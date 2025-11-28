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

      // Handle response - check structure
      const data: any = response.data;

      if (Array.isArray(data)) {
        // Client-side filtering and pagination for array responses
        let filteredData = data;
        if (searchTitle) {
          filteredData = data.filter((movie: Movie) =>
            movie.title.toLowerCase().includes(searchTitle.toLowerCase())
          );
        }
        const startIndex = (pageNum - 1) * 10;
        const paginatedMovies = filteredData.slice(startIndex, startIndex + 10);
        setMovies(paginatedMovies);
        setTotalPages(Math.ceil(filteredData.length / 10) || 1);
      } else if (data?.data && Array.isArray(data.data)) {
        // API returns { data: [...], meta: { pages: X } }
        setMovies(data.data);
        setTotalPages(data.meta?.pages || data.pagination?.totalPages || 1);
      } else if (data?.results && Array.isArray(data.results)) {
        setMovies(data.results);
        setTotalPages(data.totalPages || 1);
      } else if (data?.movies && Array.isArray(data.movies)) {
        setMovies(data.movies);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setMovies([]);
      }
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to fetch movies');
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
