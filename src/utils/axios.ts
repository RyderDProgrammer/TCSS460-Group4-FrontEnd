import axios, { AxiosRequestConfig } from 'axios';

// next
import { getSession } from 'next-auth/react';

// ==============================|| ENVIRONMENT VALIDATION ||============================== //

if (!process.env.CREDENTIALS_API_URL) {
  throw new Error(
    'CREDENTIALS_API_URL environment variable is not set. ' +
      'Please add CREDENTIALS_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: CREDENTIALS_API_URL=http://localhost:8008'
  );
}


// ==============================|| CREDENTIALS SERVICE ||============================== //

const credentialsService = axios.create({ baseURL: process.env.CREDENTIALS_API_URL });

credentialsService.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

credentialsService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Auth/Web API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MOVIE SERVICE ||============================== //

const movieService = axios.create({ baseURL: process.env.MOVIE_API_URL?.replace('/api-docs/', '') || process.env.MOVIE_API_URL });

movieService.interceptors.request.use(
  async (config) => {
    if (process.env.MOVIE_API_KEY) {
      config.headers['X-API-Key'] = process.env.MOVIE_API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

movieService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. The Movie API server may be down.');
      return Promise.reject({ message: 'Connection refused.' });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| TV SERVICE ||============================== //

const tvService = axios.create({ baseURL: process.env.TV_API_URL?.replace('/api-docs/', '') || process.env.TV_API_URL });

tvService.interceptors.request.use(
  async (config) => {
    if (process.env.TV_API_KEY) {
      config.headers['X-API-Key'] = process.env.TV_API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

tvService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. The TV API server may be down.');
      return Promise.reject({ message: 'Connection refused.' });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| EXPORTS ||============================== //

export default credentialsService; // Maintain backward compatibility
export { credentialsService, movieService, tvService };

// Credentials service helpers
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.post(url, { ...config });

  return res.data;
};

