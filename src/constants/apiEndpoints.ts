// API endpoint constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Auth endpoints (connected to 3rd-party API)
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password', // Not connected yet
};

// Movie endpoints (not connected yet - use mock data)
export const MOVIE_ENDPOINTS = {
  LIST: '/movies',
  DETAIL: (id: string) => `/movies/${id}`,
  SEARCH: '/movies/search',
};

// TV Show endpoints (not connected yet - use mock data)
export const TV_SHOW_ENDPOINTS = {
  LIST: '/tv-shows',
  DETAIL: (id: string) => `/tv-shows/${id}`,
  SEARCH: '/tv-shows/search',
};
