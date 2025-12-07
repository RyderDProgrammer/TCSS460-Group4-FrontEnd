'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, Divider, CircularProgress, Button, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import { TVShow } from 'types/tvshow';
import { tvApi } from 'services/tvApi';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useRouter } from 'next/navigation';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface TVShowDetailProps {
  id: string;
}

export default function TVShowDetail({ id }: TVShowDetailProps) {
  const router = useRouter();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchList, setIsInWatchList] = useState(false);

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

  useEffect(() => {
    // Check if TV show is in watch list
    if (tvShow) {
      checkWatchListStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvShow]);

  const checkWatchListStatus = () => {
    try {
      const stored = localStorage.getItem('watchList');
      if (stored) {
        const watchList = JSON.parse(stored);
        const exists = watchList.some((item: any) => item.contentId === Number(id) && item.type === 'tv');
        setIsInWatchList(exists);
      }
    } catch (error) {
      console.error('Error checking watch list:', error);
    }
  };

  const handleAddToWatchList = () => {
    if (!tvShow) return;

    // Use id from the object, or fall back to the URL id parameter
    const showId = tvShow.id || Number(id);

    // Validate TV show ID
    if (!showId || isNaN(Number(showId))) {
      console.error('Cannot add TV show to watch list: Invalid ID', { tvShow, urlId: id });
      return;
    }

    try {
      const stored = localStorage.getItem('watchList');
      const watchList = stored ? JSON.parse(stored) : [];

      const newItem = {
        id: `tv-${showId}-${Date.now()}`,
        contentId: Number(showId),
        type: 'tv' as const,
        title: tvShow.name,
        posterUrl: tvShow.poster_url || tvShow.backdrop_url,
        rating: tvShow.tmdb_rating,
        genre: tvShow.genres ? tvShow.genres.split(';')[0].trim() : undefined,
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
        const filtered = watchList.filter((item: any) => !(item.contentId === Number(id) && item.type === 'tv'));
        localStorage.setItem('watchList', JSON.stringify(filtered));
        setIsInWatchList(false);
      }
    } catch (error) {
      console.error('Error removing from watch list:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (posterUrl: string | null | undefined, backdropUrl?: string | null) => {
    // Validate poster URL
    if (posterUrl && posterUrl !== 'null' && posterUrl !== 'undefined' && posterUrl.trim() !== '' && posterUrl !== '/') {
      if (posterUrl.startsWith('http')) return posterUrl;
      return `${TMDB_IMAGE_BASE}${posterUrl}`;
    }
    // Validate backdrop URL
    if (backdropUrl && backdropUrl !== 'null' && backdropUrl !== 'undefined' && backdropUrl.trim() !== '' && backdropUrl !== '/') {
      if (backdropUrl.startsWith('http')) return backdropUrl;
      return `${TMDB_IMAGE_BASE}${backdropUrl}`;
    }
    // Fallback to placeholder
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
    <MainCard
      title={tvShow.name}
      secondary={
        <IconButton onClick={() => router.back()} size="small" color="primary">
          <ArrowLeftOutlined />
        </IconButton>
      }
    >
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
                const backdropUrl = tvShow.backdrop_url.startsWith('http')
                  ? tvShow.backdrop_url
                  : `${TMDB_IMAGE_BASE}${tvShow.backdrop_url}`;
                target.src = backdropUrl;
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
            {/* Rating and Watch List Button */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip label={`TMDB: ${tvShow.tmdb_rating}`} color="primary" />
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
