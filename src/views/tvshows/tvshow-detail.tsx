'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, Divider, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import { TVShow } from 'types/tvshow';
import { tvApi } from 'services/tvApi';

interface TVShowDetailProps {
  id: string;
}

export default function TVShowDetail({ id }: TVShowDetailProps) {
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTVShow = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await tvApi.getTVShowById(Number(id));
        const data: any = response.data;

        // Handle different response structures
        if (data && typeof data === 'object') {
          if (Array.isArray(data) && data.length > 0) {
            setTVShow(data[0]);
          } else if (data.id) {
            // Direct tvshow object
            setTVShow(data);
          } else if (data.data) {
            setTVShow(Array.isArray(data.data) ? data.data[0] : data.data);
          } else if (data.show) {
            // Wrapped in 'show' key
            setTVShow(data.show);
          } else {
            setTVShow(null);
          }
        } else {
          setTVShow(null);
        }
      } catch (err: any) {
        console.error('Error fetching TV show:', err);
        setError(err.message || 'Failed to fetch TV show');
        setTVShow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShow();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (posterUrl: string | null | undefined, backdropUrl?: string | null) => {
    if (posterUrl && posterUrl !== 'null' && posterUrl !== 'undefined') {
      return posterUrl;
    }
    if (backdropUrl && backdropUrl !== 'null' && backdropUrl !== 'undefined') {
      return backdropUrl;
    }
    return 'https://via.placeholder.com/500x750?text=No+Image';
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

  if (!tvShow) {
    return (
      <MainCard title="Not Found">
        <Typography>TV show not found</Typography>
      </MainCard>
    );
  }

  // Genres are separated by semicolon in this API
  const genres = tvShow.genres ? tvShow.genres.split(';').map((g) => g.trim()) : [];

  return (
    <MainCard title={tvShow.name}>
      <Grid container spacing={3}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={getImageUrl(tvShow.poster_url, tvShow.backdrop_url)}
            alt={tvShow.name}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.currentTarget;
              if (tvShow.backdrop_url && !target.dataset.triedBackdrop) {
                target.dataset.triedBackdrop = 'true';
                target.src = tvShow.backdrop_url;
              } else {
                target.src = 'https://via.placeholder.com/500x750?text=No+Image';
              }
            }}
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
            {/* Rating */}
            <Box>
              <Chip label={`TMDB: ${tvShow.tmdb_rating}`} color="primary" />
            </Box>

            <Divider />

            {/* Status */}
            {tvShow.status && (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={tvShow.status}
                    color={tvShow.status === 'Returning Series' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
                <Divider />
              </>
            )}

            {/* Air Dates */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Air Dates
              </Typography>
              <Typography variant="body1">First Aired: {formatDate(tvShow.first_air_date)}</Typography>
              {tvShow.last_air_date && <Typography variant="body1">Last Aired: {formatDate(tvShow.last_air_date)}</Typography>}
            </Box>

            <Divider />

            {/* Seasons & Episodes */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Seasons & Episodes
              </Typography>
              <Typography variant="body1">
                {tvShow.seasons} Season{tvShow.seasons !== 1 ? 's' : ''} &bull; {tvShow.episodes} Episode
                {tvShow.episodes !== 1 ? 's' : ''}
              </Typography>
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
              <Typography variant="body1">{tvShow.overview || 'No description available.'}</Typography>
            </Box>

            <Divider />

            {/* Creators */}
            {tvShow.creators && (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Creators
                  </Typography>
                  <Typography variant="body1">{tvShow.creators}</Typography>
                </Box>
                <Divider />
              </>
            )}

            {/* Cast */}
            {tvShow.actors && (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Cast
                  </Typography>
                  <Typography variant="body1">{tvShow.actors}</Typography>
                </Box>
                <Divider />
              </>
            )}

            {/* Networks */}
            {tvShow.networks && (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Networks
                  </Typography>
                  <Typography variant="body1">{tvShow.networks}</Typography>
                </Box>
                <Divider />
              </>
            )}

            {/* Studios */}
            {tvShow.studios && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Studios
                </Typography>
                <Typography variant="body1">{tvShow.studios}</Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
