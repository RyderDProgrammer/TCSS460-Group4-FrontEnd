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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import SearchIcon from '@ant-design/icons/SearchOutlined';
import { tvApi } from 'services/tvApi';
import { TVShow } from 'types/tvshow';
import { useRouter, useSearchParams } from 'next/navigation';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function TVShowsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const searchFromUrl = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [pageInput, setPageInput] = useState('');

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
        // Client-side filtering and pagination for array responses
        let filteredData = data;
        if (searchName) {
          filteredData = data.filter((show: TVShow) =>
            show.name.toLowerCase().includes(searchName.toLowerCase())
          );
        }
        const startIndex = (pageNum - 1) * 10;
        const paginatedShows = filteredData.slice(startIndex, startIndex + 10);
        setTVShows(paginatedShows);
        setTotalPages(Math.ceil(filteredData.length / 10) || 1);
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

  // Load data when page or search from URL changes
  useEffect(() => {
    setPage(pageFromUrl);
    setSearchQuery(searchFromUrl);
    fetchTVShows(searchFromUrl, pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFromUrl, searchFromUrl]);

  // Debounced search - only run when search query actually changes
  useEffect(() => {
    if (searchQuery === '') return; // Don't run on empty search
    if (searchQuery === searchFromUrl) return; // Don't run if search matches URL (already loaded)

    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchTVShows(searchQuery, 1);
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
    fetchTVShows(searchQuery, value);
    // Update URL with new page number (use replace to avoid adding to history)
    const params = new URLSearchParams();
    params.set('page', value.toString());
    if (searchQuery) params.set('search', searchQuery);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handlePageJump = () => {
    const pageNum = parseInt(pageInput, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange({} as React.ChangeEvent<unknown>, pageNum);
      setPageDialogOpen(false);
      setPageInput('');
    }
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageJump();
    }
  };

  const getFirstGenre = (genres: string) => {
    if (!genres) return 'Unknown';
    // Genres are separated by semicolon in this API
    return genres.split(';')[0].trim();
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

  return (
    <MainCard title="TV Shows">
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
                            const backdropUrl = tvShow.backdrop_url.startsWith('http')
                              ? tvShow.backdrop_url
                              : `${TMDB_IMAGE_BASE}${tvShow.backdrop_url}`;
                            target.src = backdropUrl;
                          } else {
                            target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                          }
                        }}
                        sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
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
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setPageDialogOpen(true)}
                  sx={{ minWidth: '80px' }}
                >
                  Go to...
                </Button>
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

      {/* Page Jump Dialog */}
      <Dialog open={pageDialogOpen} onClose={() => setPageDialogOpen(false)}>
        <DialogTitle>Jump to Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Page Number"
            type="number"
            fullWidth
            variant="outlined"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyPress={handlePageInputKeyPress}
            helperText={`Enter a page number between 1 and ${totalPages}`}
            inputProps={{ min: 1, max: totalPages }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePageJump} variant="contained">
            Go
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
