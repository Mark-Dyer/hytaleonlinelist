import { api } from './api';
import type { AuthUser, LoginCredentials, RegisterCredentials, RegistrationStatus } from '@/types';

export interface MessageResponse {
  message: string;
}

export const authApi = {
  getRegistrationStatus: (): Promise<RegistrationStatus> => {
    return api.get<RegistrationStatus>('/api/auth/registration-status');
  },

  register: (credentials: RegisterCredentials): Promise<AuthUser> => {
    return api.post<AuthUser>('/api/auth/register', credentials);
  },

  login: (credentials: LoginCredentials): Promise<AuthUser> => {
    return api.post<AuthUser>('/api/auth/login', credentials);
  },

  logout: (): Promise<MessageResponse> => {
    return api.post<MessageResponse>('/api/auth/logout');
  },

  refresh: (): Promise<AuthUser> => {
    return api.post<AuthUser>('/api/auth/refresh');
  },

  me: (): Promise<AuthUser> => {
    return api.get<AuthUser>('/api/auth/me');
  },

  verifyEmail: (token: string): Promise<MessageResponse> => {
    return api.post<MessageResponse>(`/api/auth/verify-email?token=${token}`);
  },

  resendVerification: (): Promise<MessageResponse> => {
    return api.post<MessageResponse>('/api/auth/resend-verification');
  },

  forgotPassword: (email: string): Promise<MessageResponse> => {
    return api.post<MessageResponse>('/api/auth/forgot-password', { email });
  },

  resetPassword: (token: string, password: string): Promise<MessageResponse> => {
    return api.post<MessageResponse>('/api/auth/reset-password', { token, password });
  },
};
