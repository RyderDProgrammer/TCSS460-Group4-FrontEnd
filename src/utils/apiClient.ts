// API client configuration
import { getAuthToken } from './authOptions';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Create API client with authentication headers
 */
export async function apiClient<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: config.method || 'GET',
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * GET request
 */
export async function get<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return apiClient<T>(url, { method: 'GET', headers });
}

/**
 * POST request
 */
export async function post<T>(
  url: string,
  body: any,
  headers?: Record<string, string>
): Promise<T> {
  return apiClient<T>(url, { method: 'POST', body, headers });
}

/**
 * PUT request
 */
export async function put<T>(
  url: string,
  body: any,
  headers?: Record<string, string>
): Promise<T> {
  return apiClient<T>(url, { method: 'PUT', body, headers });
}

/**
 * DELETE request
 */
export async function del<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return apiClient<T>(url, { method: 'DELETE', headers });
}
