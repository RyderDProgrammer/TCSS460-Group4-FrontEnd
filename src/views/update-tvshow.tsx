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
import { tvApi, UpdateTVShowPayload } from 'services/tvApi';
import { TVShow } from 'types/tvshow';

// Form value interface - all fields optional for updates
interface TVShowUpdateFormValues {
  name?: string;
  original_name?: string;
  first_air_date?: string;
  last_air_date?: string;
  seasons?: string;
  episodes?: string;
  status?: string;
  overview?: string;
  genres?: string;
  networks?: string;
  creators?: string;
  studios?: string;
  actors?: string;
  popularity?: string;
  tmdb_rating?: string;
  vote_count?: string;
  poster_url?: string;
  backdrop_url?: string;
}

// Validation schema - all fields optional
const validationSchema = Yup.object().shape({
  name: Yup.string(),
  original_name: Yup.string(),
  first_air_date: Yup.string(),
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

const initialValues: TVShowUpdateFormValues = {
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

// Transform form values to API payload - only include non-empty fields
const transformToPayload = (values: TVShowUpdateFormValues): UpdateTVShowPayload => {
  const payload: UpdateTVShowPayload = {};

  if (values.name) payload.name = values.name;
  if (values.original_name) payload.original_name = values.original_name;
  if (values.first_air_date) payload.first_air_date = values.first_air_date;
  if (values.last_air_date) payload.last_air_date = values.last_air_date;
  if (values.seasons) payload.seasons = parseInt(values.seasons, 10);
  if (values.episodes) payload.episodes = parseInt(values.episodes, 10);
  if (values.status) payload.status = values.status;
  if (values.overview) payload.overview = values.overview;
  if (values.genres) payload.genres = values.genres;
  if (values.networks) payload.networks = values.networks;
  if (values.creators) payload.creators = values.creators;
  if (values.studios) payload.studios = values.studios;
  if (values.actors) payload.actors = values.actors;
  if (values.popularity) payload.popularity = parseFloat(values.popularity);
  if (values.tmdb_rating) payload.tmdb_rating = parseFloat(values.tmdb_rating);
  if (values.vote_count) payload.vote_count = parseInt(values.vote_count, 10);
  if (values.poster_url) payload.poster_url = values.poster_url;
  if (values.backdrop_url) payload.backdrop_url = values.backdrop_url;

  return payload;
};

export default function UpdateTVShowView() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
  const [showSearchQuery, setShowSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setShows([]);
      setSearchError(null);
      return;
    }

    setLoading(true);
    setSearchError(null);
    try {
      const response = await tvApi.getTVShows({ name: query, limit: 20 });
      console.log('TV show search response:', response);

      // Accept several possible response shapes:
      // - Array: response.data = [TVShow, ...]
      // - Wrapped: response.data = { shows: [TVShow, ...] }
      // - Results: response.data = { results: [TVShow, ...] }
      const res: any = response;
      let showsData: TVShow[] = [];
      if (Array.isArray(res?.data)) {
        showsData = res.data as TVShow[];
      } else if (Array.isArray(res?.data?.shows)) {
        showsData = res.data.shows as TVShow[];
      } else if (Array.isArray(res?.data?.results)) {
        showsData = res.data.results as TVShow[];
      } else if (Array.isArray(res?.shows)) {
        showsData = res.shows as TVShow[];
      }

      setShows(showsData);
      if (showsData.length === 0) {
        setSearchError('No TV shows found. Try a different search term.');
      }
    } catch (err: any) {
      const errorMsg = err?.message || JSON.stringify(err);
      console.error('Error searching TV shows:', errorMsg);
      setShows([]);
      setSearchError(`Search failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleShowSelect = (show: TVShow | null) => {
    setSelectedShow(show);
    if (show) {
      setShowSearchQuery(show.name);
    }
  };

  const handleSubmit = async (
    values: TVShowUpdateFormValues,
    { setSubmitting: formikSetSubmitting }: FormikHelpers<TVShowUpdateFormValues>
  ) => {
    if (!selectedShow) {
      setError('Please select a TV show first');
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

      console.log('=== UPDATING TV SHOW ===');
      console.log(`Show ID: ${selectedShow.id}`);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await tvApi.updateTVShow(selectedShow.id, payload);

      console.log('=== TV SHOW UPDATED SUCCESSFULLY ===');
      console.log('Response:', response.data);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update TV show';
      console.error('Error updating TV show:', errorMessage);
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
                Update TV Show
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Search for a TV show, select it, then update any fields you want to change. Only modified fields will be sent to
                the API.
              </Typography>
            </Box>

            {submitted && (
              <Alert severity="success">
                TV show updated successfully! Check the console for details.
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

            {/* TV Show Selection Section */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Step 1: Select a TV Show
              </Typography>
              <Autocomplete
                freeSolo
                options={shows || []}
                getOptionLabel={(option) => {
                    if (!option) return "";
                    if (typeof option === "string") return option;
                    return option.name || "";
                }}
                value={selectedShow}
                inputValue={showSearchQuery}
                onInputChange={(event, value) => {
                  setShowSearchQuery(value);
                  handleSearch(value);
                }}
                onChange={(event, value) => {
                    if (!value) {
                        handleShowSelect(null);
                        return;
                    }

                    if (typeof value === "string") {
                        handleSearch(value);
                        return;
                    }

                    handleShowSelect(value);
                }}
                loading={loading}
                noOptionsText="No shows found. Try searching by name."
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and select a TV show"
                    placeholder="e.g., Breaking Bad, Stranger Things"
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
              {selectedShow && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Selected:</strong> {selectedShow.name} ({selectedShow.first_air_date})
                  </Typography>
                </Alert>
              )}
            </Box>

            {selectedShow && (
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
                            label="Show Name"
                            name="name"
                            placeholder="Leave empty to keep current value"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Original Name"
                            name="original_name"
                            placeholder="Leave empty to keep current value"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="First Air Date"
                            name="first_air_date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
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
                            placeholder="Leave empty to keep current value"
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
                            placeholder="Leave empty to keep current value"
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
                            placeholder="e.g., Ended, Ongoing"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Rating"
                            name="tmdb_rating"
                            placeholder="0-10 scale"
                            error={touched.tmdb_rating && !!errors.tmdb_rating}
                            helperText={touched.tmdb_rating && errors.tmdb_rating}
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
                            placeholder="Comma or semicolon-separated"
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
                            placeholder="Semicolon-separated"
                            helperText="Only fill to update"
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
                            placeholder="Comma-separated"
                            helperText="Only fill to update"
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
                            placeholder="Comma-separated"
                            helperText="Only fill to update"
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
                            placeholder="Comma-separated actors"
                            helperText="Only fill to update"
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
                            placeholder="Updated synopsis"
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
                              {isSubmitting ? 'Updating...' : 'Update Show'}
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
