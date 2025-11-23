/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname
  },
  logging: {
    fetches: {
      fullUrl: false
    }
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      }
    ]
  },
  env: {
    NEXT_APP_VERSION: process.env.REACT_APP_VERSION,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET_KEY,
    NEXTAUTH_SECRET_KEY: process.env.NEXTAUTH_SECRET_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CREDENTIALS_API_URL: process.env.CREDENTIALS_API_URL,
    MOVIE_API_URL: process.env.MOVIE_API_URL,
    MOVIE_API_KEY: process.env.MOVIE_API_KEY,
    TV_API_URL: process.env.TV_API_URL,
    TV_API_KEY: process.env.TV_API_KEY,
    NEXT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
    NEXT_APP_JWT_TIMEOUT: process.env.REACT_APP_JWT_TIMEOUT
  }
};

module.exports = nextConfig;
