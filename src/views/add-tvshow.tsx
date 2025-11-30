'use client';

import { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';
import MainCard from 'components/MainCard';
import { tvApi, CreateTVShowPayload } from 'services/tvApi';

// Form value interface
interface TVShowFormValues {
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string;
  seasons: string;
  episodes: string;
  status: string;
  overview: string;
  genres: string;
  networks: string;
  creators: string;
  studios: string;
  actors: string;
  popularity: string;
  tmdb_rating: string;
  vote_count: string;
  poster_url: string;
  backdrop_url: string;
}

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Show name is required').min(1, 'Name must not be empty'),
  original_name: Yup.string(),
  first_air_date: Yup.string().required('First air date is required'),
  last_air_date: Yup.string(),
  seasons: Yup.string().test('is-number', 'Seasons must be a valid number', (value) => !value || (!isNaN(Number(value)) && Number(value) >= 0)),
  episodes: Yup.string().test('is-number', 'Episodes must be a valid number', (value) => !value || (!isNaN(Number(value)) && Number(value) >= 0)),
  status: Yup.string(),
  overview: Yup.string(),
  genres: Yup.string(),
  networks: Yup.string(),
  creators: Yup.string(),
  studios: Yup.string(),
  actors: Yup.string(),
  popularity: Yup.string(),
  tmdb_rating: Yup.string(),
  vote_count: Yup.string().test('is-number', 'Vote count must be a valid number', (value) => !value || !isNaN(Number(value))),
  poster_url: Yup.string().url('Poster URL must be a valid URL'),
  backdrop_url: Yup.string().url('Backdrop URL must be a valid URL')
});

// Initial values
const initialValues: TVShowFormValues = {
  name: '',
  original_name: '',
  first_air_date: '',
  last_air_date: '',
  seasons: '',
  episodes: '',
  status: '',
  overview: '',
  genres: '',
  networks: '',
  creators: '',
  studios: '',
  actors: '',
  popularity: '',
  tmdb_rating: '',
  vote_count: '',
  poster_url: '',
  backdrop_url: ''
};

// Transform form values to API payload
const transformToPayload = (values: TVShowFormValues): CreateTVShowPayload => {
  const payload: CreateTVShowPayload = {
    name: values.name,
    original_name: values.original_name || undefined,
    first_air_date: values.first_air_date,
    last_air_date: values.last_air_date || undefined,
    seasons: values.seasons ? parseInt(values.seasons, 10) : undefined,
    episodes: values.episodes ? parseInt(values.episodes, 10) : undefined,
    status: values.status || undefined,
    overview: values.overview || undefined,
    genres: values.genres || undefined,
    networks: values.networks || undefined,
    creators: values.creators || undefined,
    studios: values.studios || undefined,
    actors: values.actors || undefined,
    popularity: values.popularity ? parseFloat(values.popularity) : undefined,
    tmdb_rating: values.tmdb_rating ? parseFloat(values.tmdb_rating) : undefined,
    vote_count: values.vote_count ? parseInt(values.vote_count, 10) : undefined,
    poster_url: values.poster_url || undefined,
    backdrop_url: values.backdrop_url || undefined
  };

  return payload;
};

export default function AddTVShowView() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: TVShowFormValues,
    { setSubmitting: formikSetSubmitting }: FormikHelpers<TVShowFormValues>
  ) => {
    try {
      setError(null);
      const payload = transformToPayload(values);

      console.log('=== SUBMITTING TV SHOW TO API ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await tvApi.createTVShow(payload);

      console.log('=== TV SHOW CREATED SUCCESSFULLY ===');
      console.log('Response:', response.data);

      // Show success message
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create TV show';
      console.error('Error submitting TV show:', errorMessage);
      setError(errorMessage);
    } finally {
      formikSetSubmitting(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Add New TV Show
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fill in the TV show information below. Required fields are marked with an asterisk (*). This will create a new entry
                in the database.
              </Typography>
            </Box>

            {submitted && (
              <Alert severity="success">
                TV show created successfully! Check the console for details.
              </Alert>
            )}

            {error && (
              <Alert severity="error">
                Error: {error}
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnChange
              validateOnBlur
            >
              {({ isSubmitting, touched, errors, values }) => (
                <Form>
                  <Grid container spacing={3}>
                    {/* Basic Information Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Basic Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Show Name *"
                        name="name"
                        placeholder="Enter TV show name"
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Original Name"
                        name="original_name"
                        placeholder="Enter original name if different"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="First Air Date *"
                        name="first_air_date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={touched.first_air_date && !!errors.first_air_date}
                        helperText={touched.first_air_date && errors.first_air_date}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Last Air Date"
                        name="last_air_date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Series Information Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Series Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Number of Seasons"
                        name="seasons"
                        type="number"
                        placeholder="e.g., 5"
                        error={touched.seasons && !!errors.seasons}
                        helperText={touched.seasons && errors.seasons}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Number of Episodes"
                        name="episodes"
                        type="number"
                        placeholder="e.g., 50"
                        error={touched.episodes && !!errors.episodes}
                        helperText={touched.episodes && errors.episodes}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Status"
                        name="status"
                        placeholder="e.g., Ongoing, Ended, Canceled"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Rating"
                        name="tmdb_rating"
                        placeholder="e.g., 8.5"
                      />
                    </Grid>

                    {/* Details Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Details
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Creators"
                        name="creators"
                        placeholder="e.g., Creator 1, Creator 2"
                        helperText="Semicolon-separated or comma-separated"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Genres"
                        name="genres"
                        placeholder="e.g., Drama;Action;Thriller"
                        helperText="Semicolon-separated"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Networks"
                        name="networks"
                        placeholder="e.g., HBO, Netflix, Showtime"
                        helperText="Comma-separated"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Studios"
                        name="studios"
                        placeholder="e.g., Studio 1, Studio 2"
                        helperText="Comma-separated"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Cast (Actors)"
                        name="actors"
                        placeholder="e.g., Actor 1, Actor 2, Actor 3"
                        helperText="Comma-separated"
                        multiline
                        rows={3}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Overview"
                        name="overview"
                        placeholder="Enter show synopsis or description"
                        multiline
                        rows={4}
                      />
                    </Grid>

                    {/* Metrics Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Metrics
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Popularity"
                        name="popularity"
                        placeholder="e.g., 85.5"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Vote Count"
                        name="vote_count"
                        type="number"
                        placeholder="e.g., 1500"
                        error={touched.vote_count && !!errors.vote_count}
                        helperText={touched.vote_count && errors.vote_count}
                      />
                    </Grid>

                    {/* Media URLs Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Media URLs
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Poster URL"
                        name="poster_url"
                        placeholder="https://example.com/poster.jpg"
                        error={touched.poster_url && !!errors.poster_url}
                        helperText={touched.poster_url && errors.poster_url}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Backdrop URL"
                        name="backdrop_url"
                        placeholder="https://example.com/backdrop.jpg"
                        error={touched.backdrop_url && !!errors.backdrop_url}
                        helperText={touched.backdrop_url && errors.backdrop_url}
                      />
                    </Grid>

                    {/* Form Actions */}
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                          startIcon={
                            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
                          }
                        >
                          {isSubmitting ? 'Creating Show...' : 'Create TV Show'}
                        </Button>
                        <Button variant="outlined" color="secondary" type="reset">
                          Clear Form
                        </Button>
                      </Stack>
                    </Grid>

                    {/* Data Preview (for debugging) */}
                    {process.env.NODE_ENV === 'development' && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                            API Payload Preview (Dev Only):
                          </Typography>
                          <pre style={{ fontSize: '11px', overflow: 'auto', maxHeight: '300px' }}>
                            {JSON.stringify(transformToPayload(values), null, 2)}
                          </pre>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Form>
              )}
            </Formik>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
