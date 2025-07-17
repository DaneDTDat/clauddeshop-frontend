export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  SHOP_OWNER = 'shop_owner',
  ADMIN = 'admin'
}

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: TokenResponse;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
