import { User } from './user.model';
import { Product } from './product.model';

export interface Shop {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  status: ShopStatus;
  ownerId: number;
  imageUrl?: string;
  productCount?: number;
  revenue?: number;
  customerCount?: number;
  owner?: User;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export enum ShopStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface ShopCreateRequest {
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface ShopUpdateRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: ShopStatus;
}

export interface ShopListResponse {
  shops: Shop[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ShopDetailResponse {
  shop: Shop;
}
