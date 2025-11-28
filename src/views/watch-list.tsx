'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface WatchListItem {
  id: string;
  contentId: number;
  type: 'movie' | 'tv';
  title: string;
  posterUrl: string;
  rating?: string;
  genre?: string;
  addedDate: string;
}

export default function WatchListView() {
  const [watchList, setWatchList] = useState<WatchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    // Load watch list from localStorage
    loadWatchList();
  }, []);

  const loadWatchList = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('watchList');
      if (stored) {
        const items: WatchListItem[] = JSON.parse(stored);
        // Filter out any items with invalid contentId
        const validItems = items.filter((item) => {
          const isValid = item.contentId && !isNaN(Number(item.contentId));
          if (!isValid) {
            console.warn('Filtering out invalid watch list item:', item);
          }
          return isValid;
        });
        setWatchList(validItems);
        // Update localStorage with only valid items
        if (validItems.length !== items.length) {
          localStorage.setItem('watchList', JSON.stringify(validItems));
        }
      }
    } catch (error) {
      console.error('Error loading watch list:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchList = (id: string) => {
    const updatedList = watchList.filter((item) => item.id !== id);
    setWatchList(updatedList);
    localStorage.setItem('watchList', JSON.stringify(updatedList));
  };

  const getImageUrl = (posterPath: string) => {
    if (!posterPath) return '/placeholder-movie.png';
    if (posterPath.startsWith('http')) return posterPath;
    return `${TMDB_IMAGE_BASE}${posterPath}`;
  };

  const filteredItems = watchList.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'all' | 'movie' | 'tv') => {
    setFilter(newValue);
  };

  const handleClearAll = () => {
    localStorage.removeItem('watchList');
    setWatchList([]);
    setClearDialogOpen(false);
  };

  return (
    <MainCard
      title="Watch List"
      secondary={
        watchList.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearOutlined />}
            onClick={() => setClearDialogOpen(true)}
            size="small"
          >
            Clear All
          </Button>
        )
      }
    >
      <Stack spacing={3}>
        {/* Filter Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={filter} onChange={handleTabChange}>
            <Tab label="All" value="all" />
            <Tab label="Movies" value="movie" />
            <Tab label="TV Shows" value="tv" />
          </Tabs>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Watch List Grid */}
        {!loading && filteredItems.length > 0 && (
          <Grid container spacing={2}>
            {filteredItems.map((item) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.2s, boxShadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4
                    }
                  }}
                >
                  {/* Remove Button */}
                  <IconButton
                    onClick={() => removeFromWatchList(item.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 0, 0, 0.8)'
                      },
                      zIndex: 1
                    }}
                    size="small"
                  >
                    <DeleteOutlined />
                  </IconButton>

                  <Link href={`/${item.type === 'movie' ? 'movies' : 'tvshows'}/${item.contentId}`} style={{ textDecoration: 'none' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(item.posterUrl)}
                      alt={item.title}
                      sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="subtitle2" noWrap>
                        {item.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                        <Chip label={item.type === 'movie' ? 'Movie' : 'TV Show'} size="small" variant="outlined" color="primary" />
                        {item.rating && <Chip label={item.rating} size="small" variant="outlined" />}
                        {item.genre && <Chip label={item.genre} size="small" variant="outlined" />}
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Added {new Date(item.addedDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your watch list is empty
            </Typography>
            <Typography color="text.secondary">
              {filter === 'all'
                ? 'Add movies and TV shows to your watch list to see them here.'
                : `No ${filter === 'movie' ? 'movies' : 'TV shows'} in your watch list.`}
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Watch List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all items from your watch list? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
