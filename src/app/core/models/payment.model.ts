import { User } from './user.model';
import { Shop } from './shop.model';

export interface Payment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id: string;
  notes: string;
  user_id: number;
  shop_id: number;
  user?: User;
  shop?: Shop;
  created_at: string;
  updated_at: string;
}

export enum PaymentMethod {
  CASH = 'cash'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface PaymentCreateRequest {
  amount: number;
  method: PaymentMethod;
  notes?: string;
  shop_id: number;
}

export interface PaymentUpdateRequest {
  status: PaymentStatus;
  notes?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaymentSummary {
  total_amount: number;
  total_count: number;
  completed_count: number;
  pending_count: number;
  failed_count: number;
  refunded_count: number;
}

export interface PaymentDetailResponse {
  message: string;
  payment: Payment;
}
