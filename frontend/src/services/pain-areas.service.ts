import apiClient from '../api/client';
import type { PainAreaOption } from '../types/pain-area';

export async function getPainAreas() {
  const response = await apiClient.get<PainAreaOption[]>('/pain-areas');
  return response.data;
}

export async function createPainArea(name: string) {
  const response = await apiClient.post<PainAreaOption>('/pain-areas', {
    name,
  });
  return response.data;
}
