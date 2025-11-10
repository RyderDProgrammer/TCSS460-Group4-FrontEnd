// Axios configuration (if using axios for API calls)
// Alternative to fetch-based apiClient

// Uncomment and install axios if needed: npm install axios
// import axios from 'axios';
// import { getAuthToken } from '@/utils/authOptions';

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   timeout: 10000,
// });

// // Request interceptor to add auth token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401 errors (unauthorized)
//     if (error.response?.status === 401) {
//       // Redirect to login or refresh token
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

export const axiosPlaceholder = 'Configure axios if needed';
