'use client';

import { useState, useCallback } from 'react';
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
  Paper,
  Autocomplete
} from '@mui/material';
import MainCard from 'components/MainCard';
import { movieApi, UpdateMoviePayload } from 'services/movieApi';
import { Movie } from 'types/movie';

// Form value interface - all fields optional for updates
interface MovieUpdateFormValues {
  title?: string;
  original_title?: string;
  directors?: string;
  genres?: string;
  release_date?: string;
  runtime_minutes?: string;
  overview?: string;
  budget?: string;
  revenue?: string;
  mpa_rating?: string;
  collection_name?: string;
  producers?: string;
  studios_json?: string;
  cast_json?: string;
  poster_url?: string;
  backdrop_url?: string;
}

// Validation schema - all fields optional
const validationSchema = Yup.object().shape({
  title: Yup.string(),
  original_title: Yup.string(),
  directors: Yup.string(),
  genres: Yup.string(),
  release_date: Yup.string(),
  runtime_minutes: Yup.string().test('is-number', 'Runtime must be a valid number', (value) => !value || (!isNaN(Number(value)) && Number(value) > 0)),
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

const initialValues: MovieUpdateFormValues = {
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

// Transform form values to API payload - only include non-empty fields
const transformToPayload = (values: MovieUpdateFormValues): UpdateMoviePayload => {
  const payload: UpdateMoviePayload = {};

  if (values.title) payload.title = values.title;
  if (values.original_title) payload.original_title = values.original_title;
  if (values.release_date) payload.release_date = values.release_date;
  if (values.runtime_minutes) payload.runtime_minutes = parseInt(values.runtime_minutes, 10);
  if (values.overview) payload.overview = values.overview;
  if (values.budget) payload.budget = parseFloat(values.budget);
  if (values.revenue) payload.revenue = parseFloat(values.revenue);
  if (values.mpa_rating) payload.mpa_rating = values.mpa_rating;
  if (values.collection_name) payload.collection_name = values.collection_name;
  if (values.poster_url) payload.poster_url = values.poster_url;
  if (values.backdrop_url) payload.backdrop_url = values.backdrop_url;

  if (values.genres) {
    payload.genres = values.genres.split(',').map((g) => g.trim()).filter((g) => g);
  }
  if (values.directors) {
    payload.directors = values.directors.split(',').map((d) => d.trim()).filter((d) => d);
  }
  if (values.producers) {
    payload.producers = values.producers.split(',').map((p) => p.trim()).filter((p) => p);
  }

  if (values.studios_json?.trim()) {
    try {
      payload.studios = JSON.parse(values.studios_json);
    } catch (e) {
      console.warn('Invalid studios JSON:', e);
    }
  }

  if (values.cast_json?.trim()) {
    try {
      payload.cast = JSON.parse(values.cast_json);
    } catch (e) {
      console.warn('Invalid cast JSON:', e);
    }
  }

  return payload;
};

export default function UpdateMovieView() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      setSearchError(null);
      return;
    }

    setLoading(true);
    setSearchError(null);
    try {
      const response = await movieApi.getMovies({ title: query, limit: 20 });
      console.log('Movie search response:', response);

      // Accept several possible response shapes returned by different APIs:
      // - Array: response.data = [Movie, ...]
      // - Wrapped: response.data = { movies: [Movie, ...], ... }
      // - Results: response.data = { results: [Movie, ...], ... }
      const res: any = response;
      let moviesData: Movie[] = [];
      if (Array.isArray(res)) {
        moviesData = res as Movie[];
      } else if (Array.isArray(res?.data)) {
        moviesData = res.data as Movie[];
      } else if (Array.isArray(res?.data?.data)) {
        moviesData = res.data.data as Movie[];
      } else if (Array.isArray(res?.data?.movies)) {
        moviesData = res.data.movies as Movie[];
      } else if (Array.isArray(res?.data?.results)) {
        moviesData = res.data.results as Movie[];
      } else if (Array.isArray(res?.movies)) {
        moviesData = res.movies as Movie[];
      }

      setMovies(moviesData);
      if (moviesData.length === 0) {
        setSearchError('No movies found. Try a different search term.');
      }
    } catch (err: any) {
      const errorMsg = err?.message || JSON.stringify(err);
      console.error('Error searching movies:', errorMsg);
      setMovies([]);
      setSearchError(`Search failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMovieSelect = (movie: Movie | null) => {
    setSelectedMovie(movie);
    if (movie) {
      setMovieSearchQuery(movie.title);
    }
  };

  const handleSubmit = async (
    values: MovieUpdateFormValues,
    { setSubmitting: formikSetSubmitting }: FormikHelpers<MovieUpdateFormValues>
  ) => {
    if (!selectedMovie) {
      setError('Please select a movie first');
      formikSetSubmitting(false);
      return;
    }

    try {
      setError(null);
      const payload = transformToPayload(values);

      // Check if any fields were actually modified
      if (Object.keys(payload).length === 0) {
        setError('Please modify at least one field');
        formikSetSubmitting(false);
        return;
      }

      console.log('=== UPDATING MOVIE ===');
      console.log(`Movie ID: ${selectedMovie.movie_id}`);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await movieApi.updateMovie(selectedMovie.movie_id, payload);

      console.log('=== MOVIE UPDATED SUCCESSFULLY ===');
      console.log('Response:', response.data);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update movie';
      console.error('Error updating movie:', errorMessage);
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
                Update Movie
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Search for a movie, select it, then update any fields you want to change. Only modified fields will be sent to the
                API.
              </Typography>
            </Box>

            {submitted && (
              <Alert severity="success">
                Movie updated successfully! Check the console for details.
              </Alert>
            )}

            {error && (
              <Alert severity="error">
                Error: {error}
              </Alert>
            )}

            {searchError && (
              <Alert severity="warning">
                {searchError}
              </Alert>
            )}

            {/* Movie Selection Section */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Step 1: Select a Movie
              </Typography>
              <Autocomplete
                freeSolo
                options={movies ?? []}
                getOptionLabel={(option) => {
                    if (!option) return "";
                    if (typeof option === "string") return option;
                    return option.title || "";
                }}
                value={selectedMovie}

                inputValue={movieSearchQuery}
                onInputChange={(event, value) => {
                  setMovieSearchQuery(value);
                  handleSearch(value);
                }}
                onChange={(event, value) => {
                  if (!value) {
                    handleMovieSelect(null);
                    return;
                  }

                  if (typeof value === 'string') {
                    // user pressed Enter: set the input, clear selection and perform search
                    setMovieSearchQuery(value);
                    handleMovieSelect(null);
                    handleSearch(value);
                    return;
                  }

                  // user selected a movie object
                  handleMovieSelect(value as Movie);
                }}
                loading={loading}
                noOptionsText="No movies found. Try searching by title."
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and select a movie"
                    placeholder="e.g., The Matrix, Inception"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
              {selectedMovie && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Selected:</strong> {selectedMovie.title} ({selectedMovie.release_date})
                  </Typography>
                </Alert>
              )}
            </Box>

            {selectedMovie && (
              <>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Step 2: Update Fields
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Leave fields empty if you don't want to change them. Only fill in the fields you want to update.
                  </Typography>
                </Box>

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
                            label="Title"
                            name="title"
                            placeholder="Leave empty to keep current value"
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
                            placeholder="Leave empty to keep current value"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Release Date"
                            name="release_date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Runtime (minutes)"
                            name="runtime_minutes"
                            type="number"
                            placeholder="Leave empty to keep current value"
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
                            placeholder="Comma-separated list"
                            helperText="Only fill to update"
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
                            placeholder="Comma-separated list"
                            helperText="Only fill to update"
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
                            placeholder="Comma-separated list"
                            helperText="Only fill to update"
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
                            placeholder="e.g., PG-13, R"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Budget"
                            name="budget"
                            placeholder="Numeric value"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Revenue"
                            name="revenue"
                            placeholder="Numeric value"
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
                            placeholder="Updated synopsis"
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
                              {isSubmitting ? 'Updating...' : 'Update Movie'}
                            </Button>
                            <Button variant="outlined" color="secondary" type="reset">
                              Clear Form
                            </Button>
                          </Stack>
                        </Grid>

                        {/* Data Preview */}
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
              </>
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
