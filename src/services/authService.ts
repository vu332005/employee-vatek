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
  loginWithGoogle: async (googleUser: { email: string; name: string; picture?: string }): Promise<User> => {
    const response = await axiosClient.get<User[]>('/users', {
      params: { email: googleUser.email },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    const createResponse = await axiosClient.post<User>('/users', {
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });
    return createResponse.data;
  },
  loginWithFacebook: async (fbUser: { email: string; name: string; picture?: string }): Promise<User> => {
    const response = await axiosClient.get<User[]>('/users', {
      params: { email: fbUser.email },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    const createResponse = await axiosClient.post<User>('/users', {
      email: fbUser.email,
      name: fbUser.name,
      picture: fbUser.picture,
    });
    return createResponse.data;
  },
};
