import apiClient from '../api/client';
import type { RegisterRequest, LoginRequest, AuthResponse, User } from '../types/auth';
import { setToken, removeToken } from '../utils/token';

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  if (response.data.accessToken) {
    setToken(response.data.accessToken);
  }
  return response.data;
};

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  if (response.data.accessToken) {
    setToken(response.data.accessToken);
  }
  return response.data;
};

export const getCurrentUserApi = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};

export const logoutApi = (): void => {
  removeToken();
};
