import { Shop } from './shop.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  status: ProductStatus;
  stock: number;
  shop_id: number;
  shop?: Shop;
  created_at: string;
  updated_at: string;
}

export enum ProductStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  DISCONTINUED = 'discontinued'
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  stock?: number;
  shop_id: number;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  status?: ProductStatus;
  stock?: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface MenuResponse {
  shop_id: number;
  shop_name: string;
  categories: { [key: string]: Product[] };
  updated_at: string;
}

export interface ProductDetailResponse {
  product: Product;
}
