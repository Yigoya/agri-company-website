import apiClient from './client';
import type { Product, ProductListItem, ProductCategory, PaginatedResponse, ProductImage, MessageResponse } from '@/types';

export const productsApi = {
  getProducts: async (params?: {
    page?: number;
    page_size?: number;
    category_id?: number;
    search?: string;
    featured?: boolean;
  }): Promise<PaginatedResponse<ProductListItem>> => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getAllProducts: async (params?: {
    page?: number;
    page_size?: number;
    category_id?: number;
    search?: string;
  }): Promise<PaginatedResponse<ProductListItem>> => {
    const { data } = await apiClient.get('/products/all', { params });
    return data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${slug}`);
    return data;
  },

  createProduct: async (product: Record<string, unknown>): Promise<Product> => {
    const { data } = await apiClient.post('/products', product);
    return data;
  },

  updateProduct: async (id: number, product: Record<string, unknown>): Promise<Product> => {
    const { data } = await apiClient.put(`/products/${id}`, product);
    return data;
  },

  deleteProduct: async (id: number): Promise<MessageResponse> => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<ProductCategory[]> => {
    const { data } = await apiClient.get('/products/categories');
    return data;
  },

  createCategory: async (category: Record<string, unknown>): Promise<ProductCategory> => {
    const { data } = await apiClient.post('/products/categories', category);
    return data;
  },

  updateCategory: async (id: number, category: Record<string, unknown>): Promise<ProductCategory> => {
    const { data } = await apiClient.put(`/products/categories/${id}`, category);
    return data;
  },

  deleteCategory: async (id: number): Promise<MessageResponse> => {
    const { data } = await apiClient.delete(`/products/categories/${id}`);
    return data;
  },

  uploadProductImage: async (productId: number, file: File, isPrimary: boolean = false): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post(`/products/${productId}/images?is_primary=${isPrimary}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteProductImage: async (imageId: number): Promise<MessageResponse> => {
    const { data } = await apiClient.delete(`/products/images/${imageId}`);
    return data;
  },
};
