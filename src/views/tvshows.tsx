'use client';

import { useState } from 'react';
import { Grid, Box, Card, CardMedia, CardContent, Typography, Stack, Chip, TextField, InputAdornment } from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';
import SearchIcon from '@ant-design/icons/SearchOutlined';

export default function TVShowsView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - will be replaced with API data
  const tvShows: any[] = [];

  const filteredTVShows = tvShows.filter(
    (show) => show.name.toLowerCase().includes(searchQuery.toLowerCase()) || show.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainCard title="TV Shows">
      <Stack spacing={3}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search TV shows..."
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

        {/* TV Shows Grid */}
        {filteredTVShows.length > 0 ? (
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
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary">
              {searchQuery ? `No TV shows found for "${searchQuery}"` : 'No TV shows available. API integration coming soon.'}
            </Typography>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}
