import axiosClient from '../configs/axiosClient';
import type { User } from '../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await axiosClient.get<User[]>('/users', {
      params: { email, password },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error('Email hoặc mật khẩu không chính xác!');
  },
};
