import { Product } from './product.model';
import { User } from './user.model';

// This enum should match the backend definition
export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Processing = 'Processing',
  Shipped = 'Shipped',
  OutOfDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Returned = 'Returned',
  Refunded = 'Refunded',
  Failed = 'Failed',
  OnHold = 'On Hold'
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total: number;
  shipping_address: string;
  billing_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user: User;
}

// Request body for creating a new order
export interface CreateOrderRequest {
  shipping_address: string;
  billing_address?: string;
  items: { product_id: number; quantity: number }[];
}
