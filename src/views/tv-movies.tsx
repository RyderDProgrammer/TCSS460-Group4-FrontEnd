'use client';

import { useState } from 'react';
import { Grid, Box, Card, CardMedia, CardContent, Typography, Stack, Chip, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import { mockMovies } from 'data/mockMovies';
import { mockTVShows } from 'data/mockTVShows';
import SearchIcon from '@ant-design/icons/SearchOutlined';

export default function TvMoviesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0);

  // Filter logic
  const filteredMovies = mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTVShows = mockTVShows.filter((show) =>
    show.name.toLowerCase().includes(searchQuery.toLowerCase()) || show.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shouldShowMovies = activeTab === 0 || activeTab === 1;
  const shouldShowTV = activeTab === 0 || activeTab === 2;

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

        {/* Movies Section */}
        {shouldShowMovies && filteredMovies.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Movies ({filteredMovies.length})
            </Typography>
            <Grid container spacing={2}>
              {filteredMovies.map((movie) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                  <Link href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
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
                      <CardMedia component="img" height="200" image={movie.posterUrl} alt={movie.title} />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {movie.title}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                          <Chip label={`⭐ ${movie.rating}`} size="small" variant="outlined" />
                          <Chip label={movie.genre[0]} size="small" variant="outlined" />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TV Shows Section */}
        {shouldShowTV && filteredTVShows.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              TV Shows ({filteredTVShows.length})
            </Typography>
            <Grid container spacing={2}>
              {filteredTVShows.map((tvShow) => (
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
                      <CardMedia component="img" height="200" image={tvShow.posterUrl} alt={tvShow.name} />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {tvShow.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                          <Chip label={`⭐ ${tvShow.rating}`} size="small" variant="outlined" />
                          <Chip label={tvShow.genre[0]} size="small" variant="outlined" />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* No Results */}
        {((shouldShowMovies && filteredMovies.length === 0) || (shouldShowTV && filteredTVShows.length === 0)) && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">No results found for "{searchQuery}"</Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}
