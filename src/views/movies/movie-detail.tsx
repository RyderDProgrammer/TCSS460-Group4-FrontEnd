'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, Divider, CardMedia } from '@mui/material';
import MainCard from 'components/MainCard';
import { IMovie } from 'types/movie';
import { getMockMovieById } from 'data/mockMovies';

interface MovieDetailProps {
  id: string;
}

export default function MovieDetail({ id }: MovieDetailProps) {
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchMovie = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getMockMovieById(id);
      setMovie(data || null);
      setLoading(false);
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <MainCard title="Loading...">
        <Typography>Loading movie details...</Typography>
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

  return (
    <MainCard title={movie.title}>
      <Grid container spacing={3}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            image={movie.posterUrl}
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
            {/* Tagline */}
            {movie.tagline && (
              <Typography variant="subtitle1" fontStyle="italic" color="text.secondary">
                &ldquo;{movie.tagline}&rdquo;
              </Typography>
            )}

            {/* Rating */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Rating
              </Typography>
              <Chip label={`⭐ ${movie.rating}/10`} color="primary" />
            </Box>

            <Divider />

            {/* Release Date */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Release Date
              </Typography>
              <Typography variant="body1">{new Date(movie.releaseDate).toLocaleDateString()}</Typography>
            </Box>

            <Divider />

            {/* Runtime */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Runtime
              </Typography>
              <Typography variant="body1">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </Typography>
            </Box>

            <Divider />

            {/* Genre */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Genre
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {movie.genre.map((g) => (
                  <Chip key={g} label={g} variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">{movie.description}</Typography>
            </Box>

            <Divider />

            {/* Director */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Director
              </Typography>
              <Typography variant="body1">{movie.director}</Typography>
            </Box>

            <Divider />

            {/* Cast */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Typography variant="body1">{movie.cast.join(', ')}</Typography>
            </Box>

            <Divider />

            {/* Language */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Language
              </Typography>
              <Typography variant="body1">{movie.language}</Typography>
            </Box>

            {/* Budget & Revenue */}
            {(movie.budget || movie.revenue) && (
              <>
                <Divider />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Box Office
                  </Typography>
                  {movie.budget && <Typography variant="body1">Budget: ${movie.budget.toLocaleString()}</Typography>}
                  {movie.revenue && <Typography variant="body1">Revenue: ${movie.revenue.toLocaleString()}</Typography>}
                </Box>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
