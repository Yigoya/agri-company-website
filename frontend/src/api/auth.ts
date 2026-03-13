import apiClient from './client';
import type { Token, User } from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<Token> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
