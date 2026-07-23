import apiClient from '../api/client';

interface UploadResponse {
  secureUrl: string;
}

export async function uploadYogaPoseImage(
  file: File,
  onProgress: (progress: number) => void,
) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<UploadResponse>(
    '/uploads/yoga-pose',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    },
  );

  return response.data.secureUrl;
}
