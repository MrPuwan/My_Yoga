import axios from 'axios';
import apiClient from '../api/client';
import type {
  HealthProfile,
  HealthProfilePayload,
} from '../types/health-profile';

export async function getMyHealthProfile(): Promise<HealthProfile | null> {
  try {
    const response = await apiClient.get<HealthProfile>('/health-profile/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createHealthProfile(data: HealthProfilePayload) {
  const response = await apiClient.post<HealthProfile>('/health-profile', data);
  return response.data;
}

export async function updateHealthProfile(data: HealthProfilePayload) {
  const response = await apiClient.put<HealthProfile>('/health-profile', data);
  return response.data;
}
