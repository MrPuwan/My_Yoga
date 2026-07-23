import apiClient from '../api/client';
import type { Recommendation } from '../types/recommendation';

export async function getMyRecommendations() {
  const response = await apiClient.get<Recommendation[]>('/recommendations/me');
  return response.data;
}
