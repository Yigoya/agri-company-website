import apiClient from './client';
import type { GalleryImage, PaginatedResponse, MessageResponse } from '@/types';

export const galleryApi = {
  getImages: async (params?: {
    page?: number;
    page_size?: number;
    category?: string;
  }): Promise<PaginatedResponse<GalleryImage>> => {
    const { data } = await apiClient.get('/gallery', { params });
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await apiClient.get('/gallery/categories');
    return data;
  },

  uploadImage: async (file: File, metadata?: {
    title?: string;
    description?: string;
    category?: string;
    sort_order?: number;
  }): Promise<GalleryImage> => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata?.title) formData.append('title', metadata.title);
    if (metadata?.description) formData.append('description', metadata.description);
    if (metadata?.category) formData.append('category', metadata.category);
    if (metadata?.sort_order !== undefined) formData.append('sort_order', String(metadata.sort_order));
    const { data } = await apiClient.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateImage: async (id: number, updates: Record<string, unknown>): Promise<GalleryImage> => {
    const { data } = await apiClient.put(`/gallery/${id}`, updates);
    return data;
  },

  deleteImage: async (id: number): Promise<MessageResponse> => {
    const { data } = await apiClient.delete(`/gallery/${id}`);
    return data;
  },
};
