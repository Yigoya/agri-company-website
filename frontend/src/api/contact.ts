import apiClient from './client';
import type { ContactInquiry, PaginatedResponse, MessageResponse } from '@/types';

export const contactApi = {
  submitInquiry: async (inquiry: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    product_id?: number;
  }): Promise<ContactInquiry> => {
    const { data } = await apiClient.post('/contact', inquiry);
    return data;
  },

  getInquiries: async (params?: {
    page?: number;
    page_size?: number;
    is_read?: boolean;
    is_archived?: boolean;
  }): Promise<PaginatedResponse<ContactInquiry>> => {
    const { data } = await apiClient.get('/contact', { params });
    return data;
  },

  getInquiry: async (id: number): Promise<ContactInquiry> => {
    const { data } = await apiClient.get(`/contact/${id}`);
    return data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const { data } = await apiClient.get('/contact/unread-count');
    return data;
  },

  markAsRead: async (id: number): Promise<ContactInquiry> => {
    const { data } = await apiClient.patch(`/contact/${id}/read`);
    return data;
  },

  archive: async (id: number): Promise<ContactInquiry> => {
    const { data } = await apiClient.patch(`/contact/${id}/archive`);
    return data;
  },

  delete: async (id: number): Promise<MessageResponse> => {
    const { data } = await apiClient.delete(`/contact/${id}`);
    return data;
  },
};
