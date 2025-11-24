import { credentialsService } from 'utils/axios';

export const authApi = {
  login: (credentials: { email: string; password: string }) => credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string; lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  changePassword: (data: { oldPassword: string; newPassword: string }, token: string) =>
    credentialsService.post('/auth/user/password/change', data, {
      headers: { Authorization: `Bearer ${token}` }
    })
};
