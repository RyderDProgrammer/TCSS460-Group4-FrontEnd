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
import { movieApi, CreateMoviePayload } from 'services/movieApi';

// Form value interface
interface MovieFormValues {
  title: string;
  original_title: string;
  directors: string;
  genres: string;
  release_date: string;
  runtime_minutes: string;
  overview: string;
  budget: string;
  revenue: string;
  mpa_rating: string;
  collection_name: string;
  producers: string;
  studios_json: string;
  cast_json: string;
  poster_url: string;
  backdrop_url: string;
}

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(1, 'Title must not be empty'),
  original_title: Yup.string(),
  directors: Yup.string(),
  genres: Yup.string(),
  release_date: Yup.string().required('Release date is required'),
  runtime_minutes: Yup.string()
    .required('Runtime is required')
    .test('is-number', 'Runtime must be a valid number', (value) => !isNaN(Number(value)) && Number(value) > 0),
  overview: Yup.string(),
  budget: Yup.string(),
  revenue: Yup.string(),
  mpa_rating: Yup.string(),
  collection_name: Yup.string(),
  producers: Yup.string(),
  studios_json: Yup.string(),
  cast_json: Yup.string(),
  poster_url: Yup.string().url('Poster URL must be a valid URL'),
  backdrop_url: Yup.string().url('Backdrop URL must be a valid URL')
});

// Initial values
const initialValues: MovieFormValues = {
  title: '',
  original_title: '',
  directors: '',
  genres: '',
  release_date: '',
  runtime_minutes: '',
  overview: '',
  budget: '',
  revenue: '',
  mpa_rating: '',
  collection_name: '',
  producers: '',
  studios_json: '',
  cast_json: '',
  poster_url: '',
  backdrop_url: ''
};

// Transform form values to API payload
const transformToPayload = (values: MovieFormValues): CreateMoviePayload => {
  const payload: CreateMoviePayload = {
    title: values.title,
    original_title: values.original_title || undefined,
    release_date: values.release_date,
    runtime_minutes: parseInt(values.runtime_minutes, 10),
    overview: values.overview || undefined,
    budget: values.budget ? parseFloat(values.budget) : undefined,
    revenue: values.revenue ? parseFloat(values.revenue) : undefined,
    mpa_rating: values.mpa_rating || undefined,
    collection_name: values.collection_name || undefined,
    poster_url: values.poster_url || undefined,
    backdrop_url: values.backdrop_url || undefined,
    genres: values.genres ? values.genres.split(',').map((g) => g.trim()).filter((g) => g) : undefined,
    directors: values.directors ? values.directors.split(',').map((d) => d.trim()).filter((d) => d) : undefined,
    producers: values.producers ? values.producers.split(',').map((p) => p.trim()).filter((p) => p) : undefined
  };

  // Parse studios JSON if provided
  if (values.studios_json.trim()) {
    try {
      payload.studios = JSON.parse(values.studios_json);
    } catch (e) {
      console.warn('Invalid studios JSON:', e);
    }
  }

  // Parse cast JSON if provided
  if (values.cast_json.trim()) {
    try {
      payload.cast = JSON.parse(values.cast_json);
    } catch (e) {
      console.warn('Invalid cast JSON:', e);
    }
  }

  return payload;
};

export default function AddMovieView() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: MovieFormValues,
    { setSubmitting: formikSetSubmitting }: FormikHelpers<MovieFormValues>
  ) => {
    try {
      setError(null);
      const payload = transformToPayload(values);

      console.log('=== SUBMITTING MOVIE TO API ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await movieApi.createMovie(payload);

      console.log('=== MOVIE CREATED SUCCESSFULLY ===');
      console.log('Response:', response.data);

      // Show success message
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create movie';
      console.error('Error submitting movie:', errorMessage);
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
                Add New Movie
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fill in the movie information below. Required fields are marked with an asterisk (*). This will create a new entry
                in the database.
              </Typography>
            </Box>

            {submitted && (
              <Alert severity="success">
                Movie created successfully! Check the console for details.
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
                        label="Title *"
                        name="title"
                        placeholder="Enter movie title"
                        error={touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Original Title"
                        name="original_title"
                        placeholder="Enter original title if different"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Release Date *"
                        name="release_date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={touched.release_date && !!errors.release_date}
                        helperText={touched.release_date && errors.release_date}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Runtime (minutes) *"
                        name="runtime_minutes"
                        type="number"
                        placeholder="e.g., 120"
                        error={touched.runtime_minutes && !!errors.runtime_minutes}
                        helperText={touched.runtime_minutes && errors.runtime_minutes}
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
                        label="Directors"
                        name="directors"
                        placeholder="e.g., Director 1, Director 2"
                        helperText="Comma-separated list"
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
                        placeholder="e.g., Action, Drama, Thriller"
                        helperText="Comma-separated list"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Producers"
                        name="producers"
                        placeholder="e.g., Producer 1, Producer 2"
                        helperText="Comma-separated list"
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="MPA Rating"
                        name="mpa_rating"
                        placeholder="e.g., PG-13, R, NC-17"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Budget"
                        name="budget"
                        placeholder="e.g., 100000000"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Revenue"
                        name="revenue"
                        placeholder="e.g., 500000000"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Collection Name"
                        name="collection_name"
                        placeholder="e.g., Marvel Cinematic Universe"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Overview"
                        name="overview"
                        placeholder="Enter movie synopsis or description"
                        multiline
                        rows={4}
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

                    {/* Advanced Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Advanced (Optional)
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        For studios and cast, provide valid JSON arrays. Leave empty if not needed.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Studios (JSON)"
                        name="studios_json"
                        placeholder='[{"studio_name": "Studio 1", "logo_url": "url", "country": "USA"}]'
                        multiline
                        rows={3}
                        error={touched.studios_json && !!errors.studios_json}
                        helperText={touched.studios_json && errors.studios_json}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Cast (JSON)"
                        name="cast_json"
                        placeholder='[{"actor_name": "Actor 1", "character_name": "Character 1", "actor_order": 1}]'
                        multiline
                        rows={3}
                        error={touched.cast_json && !!errors.cast_json}
                        helperText={touched.cast_json && errors.cast_json}
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
                          {isSubmitting ? 'Creating Movie...' : 'Create Movie'}
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
