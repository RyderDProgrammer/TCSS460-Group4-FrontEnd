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
  Pagination,
  IconButton
} from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import SearchIcon from '@ant-design/icons/SearchOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { movieApi } from 'services/movieApi';
import { Movie } from 'types/movie';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { useSnackbar } from 'notistack';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function DeleteMovieView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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
        // Client-side pagination for array responses
        const startIndex = (pageNum - 1) * 10;
        const paginatedMovies = data.slice(startIndex, startIndex + 10);
        setMovies(paginatedMovies);
        setTotalPages(Math.ceil(data.length / 10) || 1);
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

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchMovies(searchQuery, 1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchMovies]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchMovies(searchQuery, value);
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

  const handleDeleteClick = (e: React.MouseEvent, movie: Movie) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMovie(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMovie) return;

    setDeleting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Client-side delete: Remove from local state only
      setMovies((prevMovies) => prevMovies.filter((m) => m.movie_id !== selectedMovie.movie_id));

      enqueueSnackbar('Movie deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setSelectedMovie(null);
    } catch {
      enqueueSnackbar('Failed to delete movie', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedMovie(null);
  };

  return (
    <MainCard title="Delete Movies">
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
                  <Box sx={{ position: 'relative' }}>
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
                        <CardContent sx={{ p: 1, pb: 1.5 }}>
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
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => handleDeleteClick(e, movie)}
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)'
                        }
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Box>
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Movie"
        itemName={selectedMovie?.title || ''}
        itemType="Movie"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </MainCard>
  );
}
