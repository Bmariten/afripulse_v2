
import axios from 'axios';
import api from './api';
import publicApi from './publicApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: number;
  discount_price?: number;
  category?: Category;
  inventory_count: number;
  is_approved: number; // 0 for pending, 1 for approved
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
  images: {
    id: string;
    image_url: string;
    is_primary: boolean;
  }[];
  sellerBusinessName?: string;
}

export const fetchProducts = async (options: {
  featured?: boolean;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  status?: string;
  seller_id?: string;
} = {}): Promise<{ data: Product[], count: number }> => {
  try {
    const params = { ...options };
    // Use the publicApi instance for public requests
    const response = await publicApi.get(`/products`, { params });
    console.log('API response:', response.data);
    
    // Handle both response structures:
    // 1. {products: [...], count: n} format
    // 2. {data: [...], status: 'success'} format
    return {
      data: response.data.products || response.data.data || [],
      count: response.data.count || (response.data.data ? response.data.data.length : 0)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], count: 0 };
  }
};

// Fetch products specifically for the affiliate marketplace
export const fetchAffiliateMarketplaceProducts = async (options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ data: Product[], count: number }> => {
  try {
    const params = { ...options };
    // Use the authenticated API instance since this requires affiliate access
    const response = await api.get(`/for-affiliates`, { params });
    console.log('Affiliate marketplace products:', response.data);
    
    // The API returns an array of products
    return {
      data: Array.isArray(response.data) ? response.data : [],
      count: Array.isArray(response.data) ? response.data.length : 0
    };
  } catch (error) {
    console.error('Error fetching affiliate marketplace products:', error);
    return { data: [], count: 0 };
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    // Use the publicApi instance for public requests
    const response = await publicApi.get(`/products/${slug}`);
    return response.data || null; // The backend now returns the product object directly
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
};

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await publicApi.get('/categories');
    return response.data.categories || response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.product;
};

export const updateProduct = async (productId: string, formData: FormData): Promise<Product> => {
  const response = await api.put(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.product;
};

export const deleteProduct = async (productId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};
