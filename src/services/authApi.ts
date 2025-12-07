import { credentialsService } from 'utils/axios';
import axios from 'axios';

// Create a plain axios instance without interceptors for unauthenticated endpoints
const credentialsServiceNoAuth = axios.create({
  baseURL: credentialsService.defaults.baseURL
});

export const authApi = {
  login: (credentials: { email: string; password: string }) => credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string; lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  changePassword: (data: { oldPassword: string; newPassword: string }, token: string) =>
    credentialsService.post('/auth/user/password/change', data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Password Reset Flow
  requestPasswordReset: (email: string) => credentialsServiceNoAuth.post('/auth/password/reset-request', { email }),

  // Use the non-authenticated service to avoid auto-adding JWT token
  // Send both token and password in the request body as per API docs
  resetPassword: (token: string, password: string) => credentialsServiceNoAuth.post('/auth/password/reset', { token, password }),

  // Email Verification Flow
  sendVerificationEmail: (token?: string) =>
    credentialsService.post(
      '/auth/verify/email/send',
      {},
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    ),

  verifyEmail: (token: string) => credentialsServiceNoAuth.get(`/auth/verify/email/confirm?token=${token}`)
};
