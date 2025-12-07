'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Box,
  Card,
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
import { tvApi } from 'services/tvApi';
import { TVShow } from 'types/tvshow';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { useSnackbar } from 'notistack';

export default function DeleteTVShowView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchTVShows = useCallback(async (searchName?: string, pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tvApi.getTVShows({
        page: pageNum,
        limit: 10,
        name: searchName || undefined
      });

      // Handle response - check structure
      const data: any = response.data;

      if (Array.isArray(data)) {
        // Client-side pagination for array responses
        const startIndex = (pageNum - 1) * 10;
        const paginatedShows = data.slice(startIndex, startIndex + 10);
        setTVShows(paginatedShows);
        setTotalPages(Math.ceil(data.length / 10) || 1);
      } else if (data?.results && Array.isArray(data.results)) {
        // API returns more than requested, do client-side limiting
        const shows = data.results.slice(0, 10);
        setTVShows(shows);
        setTotalPages(data.totalPages || 1);
      } else if (data?.shows && Array.isArray(data.shows)) {
        setTVShows(data.shows.slice(0, 10));
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (data?.data && Array.isArray(data.data)) {
        setTVShows(data.data.slice(0, 10));
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setTVShows([]);
      }
    } catch (err: any) {
      console.error('Error fetching TV shows:', err);
      setError(err.message || 'Failed to fetch TV shows');
      setTVShows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTVShows();
  }, [fetchTVShows]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchTVShows(searchQuery, 1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchTVShows]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchTVShows(searchQuery, value);
  };

  const getFirstGenre = (genres: string) => {
    if (!genres) return 'Unknown';
    // Genres are separated by semicolon in this API
    return genres.split(';')[0].trim();
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

  const handleDeleteClick = (e: React.MouseEvent, tvShow: TVShow) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTVShow(tvShow);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTVShow) return;

    setDeleting(true);
    try {
      // Delete from database via API
      await tvApi.deleteTVShow(selectedTVShow.id);

      // Remove from local state after successful API call
      setTVShows((prevShows) => prevShows.filter((show) => show.id !== selectedTVShow.id));

      enqueueSnackbar('TV Show deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setSelectedTVShow(null);
    } catch {
      enqueueSnackbar('Failed to delete TV show', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTVShow(null);
  };

  return (
    <MainCard title="Delete TV Shows">
      <Stack spacing={3}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search TV shows by name..."
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

        {/* TV Shows Grid */}
        {!loading && !error && tvShows.length > 0 && (
          <>
            <Grid container spacing={2}>
              {tvShows.map((tvShow) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={tvShow.id}>
                  <Box sx={{ position: 'relative' }}>
                    <Link href={`/tvshows/${tvShow.id}`} style={{ textDecoration: 'none' }}>
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
                        <Box
                          component="img"
                          src={getImageUrl(tvShow.poster_url, tvShow.backdrop_url)}
                          alt={tvShow.name}
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.currentTarget;
                            // Try backdrop_url if poster fails and we haven't tried it yet
                            if (tvShow.backdrop_url && !target.dataset.triedBackdrop) {
                              target.dataset.triedBackdrop = 'true';
                              target.src = tvShow.backdrop_url;
                            } else {
                              target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                            }
                          }}
                          sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1, pb: 1.5 }}>
                          <Typography variant="subtitle2" noWrap>
                            {tvShow.name}
                          </Typography>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                            <Chip label={`${tvShow.tmdb_rating}`} size="small" variant="outlined" />
                            <Chip label={getFirstGenre(tvShow.genres)} size="small" variant="outlined" />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Link>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => handleDeleteClick(e, tvShow)}
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
        {!loading && !error && tvShows.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary">
              {searchQuery ? `No TV shows found for "${searchQuery}"` : 'No TV shows available.'}
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete TV Show"
        itemName={selectedTVShow?.name || ''}
        itemType="TV Show"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </MainCard>
  );
}
