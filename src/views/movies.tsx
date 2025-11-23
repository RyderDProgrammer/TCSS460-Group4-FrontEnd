'use client';

import { useState } from 'react';
import { Grid, Box, Card, CardMedia, CardContent, Typography, Stack, Chip, TextField, InputAdornment } from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import SearchIcon from '@ant-design/icons/SearchOutlined';

export default function MoviesView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - will be replaced with API data
  const movies: any[] = [];

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainCard title="Movies">
      <Stack spacing={3}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search movies..."
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

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
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
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary">
              {searchQuery ? `No movies found for "${searchQuery}"` : 'No movies available. API integration coming soon.'}
            </Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}
