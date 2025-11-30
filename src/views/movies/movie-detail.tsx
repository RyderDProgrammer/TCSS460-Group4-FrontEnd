'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, Divider, CardMedia, CircularProgress, Button, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import { Movie } from 'types/movie';
import { movieApi } from 'services/movieApi';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useRouter } from 'next/navigation';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface MovieDetailProps {
  id: string;
}

export default function MovieDetail({ id }: MovieDetailProps) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchList, setIsInWatchList] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await movieApi.getMovieById(Number(id));
        const data: any = response.data;

        // Handle different response structures
        if (data && typeof data === 'object') {
          if (Array.isArray(data) && data.length > 0) {
            setMovie(data[0]);
          } else if (data.movie_id) {
            // Direct movie object
            setMovie(data);
          } else if (data.title && data.poster_url) {
            // Movie object without movie_id at root (might use different key)
            setMovie(data);
          } else if (data.data) {
            setMovie(Array.isArray(data.data) ? data.data[0] : data.data);
          } else if (data.movie) {
            // Wrapped in 'movie' key
            setMovie(data.movie);
          } else {
            // Try to use it as-is if it has expected properties
            if (data.title) {
              setMovie(data);
            } else {
              setMovie(null);
            }
          }
        } else {
          setMovie(null);
        }
      } catch (err: any) {
        console.error('Error fetching movie:', err);
        setError(err.message || 'Failed to fetch movie');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    // Check if movie is in watch list
    if (movie) {
      checkWatchListStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie]);

  const checkWatchListStatus = () => {
    try {
      const stored = localStorage.getItem('watchList');
      if (stored) {
        const watchList = JSON.parse(stored);
        const exists = watchList.some((item: any) => item.contentId === Number(id) && item.type === 'movie');
        setIsInWatchList(exists);
      }
    } catch (error) {
      console.error('Error checking watch list:', error);
    }
  };

  const handleAddToWatchList = () => {
    if (!movie) return;

    // Use movie_id from the object, or fall back to the URL id parameter
    const movieId = movie.movie_id || Number(id);

    // Validate movie ID
    if (!movieId || isNaN(Number(movieId))) {
      console.error('Cannot add movie to watch list: Invalid movie ID', { movie, urlId: id });
      return;
    }

    try {
      const stored = localStorage.getItem('watchList');
      const watchList = stored ? JSON.parse(stored) : [];

      const newItem = {
        id: `movie-${movieId}-${Date.now()}`,
        contentId: Number(movieId),
        type: 'movie' as const,
        title: movie.title,
        posterUrl: movie.poster_url,
        rating: movie.mpa_rating,
        genre: movie.genres ? movie.genres.split(',')[0].trim() : undefined,
        addedDate: new Date().toISOString()
      };

      watchList.push(newItem);
      localStorage.setItem('watchList', JSON.stringify(watchList));
      setIsInWatchList(true);
    } catch (error) {
      console.error('Error adding to watch list:', error);
    }
  };

  const handleRemoveFromWatchList = () => {
    try {
      const stored = localStorage.getItem('watchList');
      if (stored) {
        const watchList = JSON.parse(stored);
        const filtered = watchList.filter((item: any) => !(item.contentId === Number(id) && item.type === 'movie'));
        localStorage.setItem('watchList', JSON.stringify(filtered));
        setIsInWatchList(false);
      }
    } catch (error) {
      console.error('Error removing from watch list:', error);
    }
  };

  const getImageUrl = (posterPath: string) => {
    if (!posterPath) return '/placeholder-movie.png';
    if (posterPath.startsWith('http')) return posterPath;
    return `${TMDB_IMAGE_BASE}${posterPath}`;
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(num)) return 'N/A';
    return `$${num.toLocaleString()}`;
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainCard title="Loading...">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard title="Error">
        <Typography color="error">{error}</Typography>
      </MainCard>
    );
  }

  if (!movie) {
    return (
      <MainCard title="Not Found">
        <Typography>Movie not found</Typography>
      </MainCard>
    );
  }

  const genres = movie.genres ? movie.genres.split(',').map((g) => g.trim()) : [];

  return (
    <MainCard
      title={movie.title}
      secondary={
        <IconButton onClick={() => router.back()} size="small" color="primary">
          <ArrowLeftOutlined />
        </IconButton>
      }
    >
      <Grid container spacing={3}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            image={getImageUrl(movie.poster_url)}
            alt={movie.title}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 3
            }}
          />
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {/* MPA Rating and Watch List Button */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {movie.mpa_rating && <Chip label={movie.mpa_rating} color="primary" />}
              <Button
                variant={isInWatchList ? 'outlined' : 'contained'}
                color={isInWatchList ? 'success' : 'primary'}
                startIcon={isInWatchList ? <CheckOutlined /> : <PlusOutlined />}
                onClick={isInWatchList ? handleRemoveFromWatchList : handleAddToWatchList}
              >
                {isInWatchList ? 'In Watch List' : 'Add to Watch List'}
              </Button>
            </Box>

            <Divider />

            {/* Release Date */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Release Date
              </Typography>
              <Typography variant="body1">{formatDate(movie.release_date)}</Typography>
            </Box>

            <Divider />

            {/* Runtime */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Runtime
              </Typography>
              <Typography variant="body1">{formatRuntime(movie.runtime_minutes)}</Typography>
            </Box>

            <Divider />

            {/* Genre */}
            {genres.length > 0 && (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Genre
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {genres.map((g) => (
                      <Chip key={g} label={g} variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <Divider />
              </>
            )}

            {/* Overview/Description */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1">{movie.overview || 'No description available.'}</Typography>
            </Box>

            <Divider />

            {/* Director */}
            {movie.directors && (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Director
                  </Typography>
                  <Typography variant="body1">{movie.directors}</Typography>
                </Box>
                <Divider />
              </>
            )}

            {/* Budget & Revenue */}
            {(movie.budget || movie.revenue) && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Box Office
                </Typography>
                {movie.budget && <Typography variant="body1">Budget: {formatCurrency(movie.budget)}</Typography>}
                {movie.revenue && <Typography variant="body1">Revenue: {formatCurrency(movie.revenue)}</Typography>}
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
