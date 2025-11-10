// Authentication options and configuration for 3rd-party Auth API
// IMPORTANT: This file MUST be modified to work with the 3rd-party Auth API

export const authConfig = {
  // TODO: Configure these values for 3rd-party Auth API
  apiBaseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || '',
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
};

/**
 * Get authentication token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(authConfig.tokenKey);
}

/**
 * Set authentication token in storage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(authConfig.tokenKey, token);
}

/**
 * Remove authentication token from storage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(authConfig.tokenKey);
  localStorage.removeItem(authConfig.refreshTokenKey);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
