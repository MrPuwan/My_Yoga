import apiClient from '../api/client';
import type {
  YogaPose,
  YogaPoseListParams,
  YogaPoseListResponse,
  YogaPosePayload,
} from '../types/yoga-pose';

export async function getYogaPoses(params: YogaPoseListParams) {
  const response = await apiClient.get<YogaPoseListResponse>('/yoga-poses', {
    params,
  });
  return response.data;
}

export async function getYogaPose(id: string) {
  const response = await apiClient.get<YogaPose>(`/yoga-poses/${id}`);
  return response.data;
}

export async function createYogaPose(data: YogaPosePayload) {
  const response = await apiClient.post<YogaPose>('/yoga-poses', data);
  return response.data;
}

export async function updateYogaPose(id: string, data: YogaPosePayload) {
  const response = await apiClient.put<YogaPose>(`/yoga-poses/${id}`, data);
  return response.data;
}

export async function deactivateYogaPose(id: string) {
  const response = await apiClient.delete<YogaPose>(`/yoga-poses/${id}`);
  return response.data;
}
