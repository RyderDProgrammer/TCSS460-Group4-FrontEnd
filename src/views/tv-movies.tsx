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
  Tabs,
  Tab,
  CircularProgress,
  Pagination
} from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import SearchIcon from '@ant-design/icons/SearchOutlined';
import { movieApi } from 'services/movieApi';
import { tvApi } from 'services/tvApi';
import { Movie } from 'types/movie';
import { TVShow } from 'types/tvshow';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function TvMoviesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTVPage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);
  const [totalTVPages, setTotalTVPages] = useState(1);

  // Determine what to show based on active tab
  const shouldShowMovies = activeTab === 0 || activeTab === 1;
  const shouldShowTV = activeTab === 0 || activeTab === 2;

  // Get the limit based on active tab (All tab = 5, individual tabs = 10)
  const getMovieLimit = () => (activeTab === 0 ? 5 : activeTab === 1 ? 10 : 0);
  const getTVLimit = () => (activeTab === 0 ? 5 : activeTab === 2 ? 10 : 0);

  // Fetch movies from API
  const fetchMovies = useCallback(
    async (searchTitle?: string, pageNum: number = 1) => {
      const limit = getMovieLimit();
      if (limit === 0) return; // Don't fetch if not showing movies

      try {
        const response = await movieApi.getMovies({
          page: pageNum,
          limit: limit,
          title: searchTitle || undefined
        });

        const data: any = response.data;

        if (Array.isArray(data)) {
          let filteredData = data;
          if (searchTitle) {
            filteredData = data.filter((movie: Movie) => movie.title.toLowerCase().includes(searchTitle.toLowerCase()));
          }
          const startIndex = (pageNum - 1) * limit;
          const paginatedMovies = filteredData.slice(startIndex, startIndex + limit);
          setMovies(paginatedMovies);
          setTotalMoviePages(Math.ceil(filteredData.length / limit) || 1);
        } else if (data?.data && Array.isArray(data.data)) {
          setMovies(data.data.slice(0, limit));
          setTotalMoviePages(Math.ceil((data.meta?.total || data.data.length) / limit) || 1);
        } else {
          setMovies([]);
        }
      } catch (err: any) {
        console.error('Error fetching movies:', err);
        setMovies([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab]
  );

  // Fetch TV shows from API
  const fetchTVShows = useCallback(
    async (searchName?: string, pageNum: number = 1) => {
      const limit = getTVLimit();
      if (limit === 0) return; // Don't fetch if not showing TV shows

      try {
        const response = await tvApi.getTVShows({
          page: pageNum,
          limit: limit,
          name: searchName || undefined
        });

        const data: any = response.data;

        if (Array.isArray(data)) {
          let filteredData = data;
          if (searchName) {
            filteredData = data.filter((show: TVShow) => show.name.toLowerCase().includes(searchName.toLowerCase()));
          }
          const startIndex = (pageNum - 1) * limit;
          const paginatedShows = filteredData.slice(startIndex, startIndex + limit);
          setTVShows(paginatedShows);
          setTotalTVPages(Math.ceil(filteredData.length / limit) || 1);
        } else if (data?.results && Array.isArray(data.results)) {
          const shows = data.results.slice(0, limit);
          setTVShows(shows);
          setTotalTVPages(data.totalPages || 1);
        } else if (data?.shows && Array.isArray(data.shows)) {
          setTVShows(data.shows.slice(0, limit));
          setTotalTVPages(data.pagination?.totalPages || 1);
        } else if (data?.data && Array.isArray(data.data)) {
          setTVShows(data.data.slice(0, limit));
          setTotalTVPages(data.pagination?.totalPages || 1);
        } else {
          setTVShows([]);
        }
      } catch (err: any) {
        console.error('Error fetching TV shows:', err);
        setTVShows([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab]
  );

  // Fetch data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const promises = [];
        if (shouldShowMovies) {
          promises.push(fetchMovies(searchQuery, moviePage));
        }
        if (shouldShowTV) {
          promises.push(fetchTVShows(searchQuery, tvPage));
        }
        await Promise.all(promises);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, moviePage, tvPage, activeTab, fetchMovies, fetchTVShows, shouldShowMovies, shouldShowTV]);

  // Reset pages when switching tabs
  useEffect(() => {
    setMoviePage(1);
    setTVPage(1);
  }, [activeTab]);

  const handleMoviePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setMoviePage(value);
  };

  const handleTVPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setTVPage(value);
  };

  const getMovieImageUrl = (posterPath: string) => {
    if (!posterPath) return '/placeholder-movie.png';
    if (posterPath.startsWith('http')) return posterPath;
    return `${TMDB_IMAGE_BASE}${posterPath}`;
  };

  const getTVImageUrl = (posterUrl: string | null | undefined, backdropUrl?: string | null) => {
    if (posterUrl && posterUrl !== 'null' && posterUrl !== 'undefined') {
      return posterUrl;
    }
    if (backdropUrl && backdropUrl !== 'null' && backdropUrl !== 'undefined') {
      return backdropUrl;
    }
    return 'https://via.placeholder.com/500x750?text=No+Image';
  };

  const getFirstGenre = (genres: string | string[]) => {
    if (!genres) return 'Unknown';
    if (typeof genres === 'string') {
      return genres.split(/[,;]/)[0].trim();
    }
    return genres[0] || 'Unknown';
  };

  return (
    <MainCard title="TV Shows & Movies">
      <Stack spacing={3}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search movies and TV shows..."
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

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab label="All" />
            <Tab label="Movies" />
            <Tab label="TV Shows" />
          </Tabs>
        </Box>

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

        {/* Movies Section */}
        {!loading && !error && shouldShowMovies && movies.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Movies ({movies.length})
            </Typography>
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
                      <CardMedia component="img" height="200" image={getMovieImageUrl(movie.poster_url)} alt={movie.title} sx={{ objectFit: 'cover' }} />
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

            {/* Pagination for Movies */}
            {totalMoviePages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalMoviePages} page={moviePage} onChange={handleMoviePageChange} color="primary" />
              </Box>
            )}
          </Box>
        )}

        {/* TV Shows Section */}
        {!loading && !error && shouldShowTV && tvShows.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              TV Shows ({tvShows.length})
            </Typography>
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
                        src={getTVImageUrl(tvShow.poster_url, tvShow.backdrop_url)}
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
                        sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {tvShow.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                          <Chip label={`${tvShow.tmdb_rating || 'N/A'}`} size="small" variant="outlined" />
                          <Chip label={getFirstGenre(tvShow.genres)} size="small" variant="outlined" />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>

            {/* Pagination for TV Shows */}
            {totalTVPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalTVPages} page={tvPage} onChange={handleTVPageChange} color="primary" />
              </Box>
            )}
          </Box>
        )}

        {/* No Results */}
        {!loading && !error && shouldShowMovies && movies.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">{searchQuery ? `No movies found for "${searchQuery}"` : 'No movies available.'}</Typography>
          </Box>
        )}

        {!loading && !error && shouldShowTV && tvShows.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">{searchQuery ? `No TV shows found for "${searchQuery}"` : 'No TV shows available.'}</Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}
