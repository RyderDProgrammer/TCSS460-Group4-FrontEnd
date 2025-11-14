'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, Divider, CardMedia } from '@mui/material';
import MainCard from 'components/MainCard';
import { ITVShow } from 'types/tvshow';
import { getMockTVShowById } from 'data/mockTVShows';

interface TVShowDetailProps {
  id: string;
}

export default function TVShowDetail({ id }: TVShowDetailProps) {
  const [tvShow, setTVShow] = useState<ITVShow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchTVShow = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getMockTVShowById(id);
      setTVShow(data || null);
      setLoading(false);
    };

    fetchTVShow();
  }, [id]);

  if (loading) {
    return (
      <MainCard title="Loading...">
        <Typography>Loading TV show details...</Typography>
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

  return (
    <MainCard title={tvShow.name}>
      <Grid container spacing={3}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            image={tvShow.posterUrl}
            alt={tvShow.name}
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
              <Typography variant="h6" gutterBottom>
                Rating
              </Typography>
              <Chip label={`⭐ ${tvShow.rating}/10`} color="primary" />
            </Box>

            <Divider />

            {/* TV Show Name */}
            <Box>
              <Typography variant="h6" gutterBottom>
                TV Show Name
              </Typography>
              <Typography variant="body1">{tvShow.name}</Typography>
            </Box>

            <Divider />

            {/* Status */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Chip label={tvShow.status} color={tvShow.status === 'Returning Series' ? 'success' : 'default'} variant="outlined" />
            </Box>

            <Divider />

            {/* Air Dates */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Air Dates
              </Typography>
              <Typography variant="body1">First Aired: {new Date(tvShow.firstAirDate).toLocaleDateString()}</Typography>
              {tvShow.lastAirDate && (
                <Typography variant="body1">Last Aired: {new Date(tvShow.lastAirDate).toLocaleDateString()}</Typography>
              )}
            </Box>

            <Divider />

            {/* Seasons & Episodes */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Seasons & Episodes
              </Typography>
              <Typography variant="body1">
                {tvShow.numberOfSeasons} Season{tvShow.numberOfSeasons !== 1 ? 's' : ''} • {tvShow.numberOfEpisodes} Episode
                {tvShow.numberOfEpisodes !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Divider />

            {/* Genre */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Genre
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tvShow.genre.map((g) => (
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
              <Typography variant="body1">{tvShow.description}</Typography>
            </Box>

            <Divider />

            {/* Creators/Producers */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Producers
              </Typography>
              <Typography variant="body1">{tvShow.creators.join(', ')}</Typography>
            </Box>

            <Divider />

            {/* Cast */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Typography variant="body1">{tvShow.cast.join(', ')}</Typography>
            </Box>

            <Divider />

            {/* Network */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Network
              </Typography>
              <Typography variant="body1">{tvShow.network}</Typography>
            </Box>

            <Divider />

            {/* Language */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Language
              </Typography>
              <Typography variant="body1">{tvShow.language}</Typography>
            </Box>

            <Divider />

            {/* Episode Runtime */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Episode Runtime
              </Typography>
              <Typography variant="body1">{tvShow.episodeRuntime.join(', ')} minutes</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
