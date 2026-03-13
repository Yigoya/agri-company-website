import apiClient from './client';
import type { BlogPost, BlogPostListItem, PaginatedResponse, MessageResponse } from '@/types';

export const blogApi = {
  getPosts: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    tag?: string;
  }): Promise<PaginatedResponse<BlogPostListItem>> => {
    const { data } = await apiClient.get('/blog', { params });
    return data;
  },

  getAllPosts: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<BlogPostListItem>> => {
    const { data } = await apiClient.get('/blog/all', { params });
    return data;
  },

  getPost: async (slug: string): Promise<BlogPost> => {
    const { data } = await apiClient.get(`/blog/${slug}`);
    return data;
  },

  createPost: async (post: Record<string, unknown>): Promise<BlogPost> => {
    const { data } = await apiClient.post('/blog', post);
    return data;
  },

  updatePost: async (id: number, post: Record<string, unknown>): Promise<BlogPost> => {
    const { data } = await apiClient.put(`/blog/${id}`, post);
    return data;
  },

  deletePost: async (id: number): Promise<MessageResponse> => {
    const { data } = await apiClient.delete(`/blog/${id}`);
    return data;
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/blog/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
