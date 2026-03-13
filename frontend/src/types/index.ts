export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string | null;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  unit: string | null;
  origin: string | null;
  harvest_season: string | null;
  packaging_info: string | null;
  specifications: string | null;
  is_featured: boolean;
  is_active: boolean;
  category_id: number | null;
  category: ProductCategory | null;
  images: ProductImage[];
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: number | null;
  unit: string | null;
  is_featured: boolean;
  category: ProductCategory | null;
  images: ProductImage[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  tags: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  author: string | null;
  tags: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
}

export interface GalleryImage {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  product_id: number | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MessageResponse {
  message: string;
  detail?: string;
}
